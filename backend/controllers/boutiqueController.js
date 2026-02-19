const Boutique = require('../models/Boutique');
const Produit = require('../models/Produit');
const Categorie = require('../models/Categorie');
const Box = require('../models/Box');
const fs = require('fs'); // Permet de supprimer les fichiers

// --- LECTURE (Pas de changement pour l'image ici) ---

exports.getPublicBoutiques = async (req, res) => {
  try {
    const boutiques = await Boutique.find({}) 
                                    .populate('id_categorie', 'nom image')
                                    .populate('id_box', 'nom etage');
                                  
    res.status(200).json(boutiques);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.getAdminBoutiques = async (req, res) => {
    try {
        const boutiques = await Boutique.find()
            .populate('id_categorie', 'nom image')
            .populate('id_box', 'nom etage')
            .populate('id_responsable', 'name fname mail'); 
        res.status(200).json(boutiques);
    } catch (error) {
        console.error("❌ ERREUR BACKEND :", error); 
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

exports.getBoutiqueById = async (req, res) => {
  try {
    const boutique = await Boutique.findById(req.params.id)
    .populate('id_categorie') 
    .populate('id_box');
    if (!boutique) return res.status(404).json({ message: "Boutique introuvable" });
    const produits = await Produit.find({ id_boutique: boutique._id });
    res.status(200).json({ boutique, produits });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.getMaBoutique = async (req, res) => {
  try {
    const userId = req.params.userId; 
    const boutique = await Boutique.findOne({ id_responsable: userId })
                                   .populate('id_box')
                                   .populate('id_categorie');

    if (!boutique) return res.status(404).json({ message: "Aucune boutique trouvée." });
    const produits = await Produit.find({ id_boutique: boutique._id });
    res.status(200).json({ boutique, produits });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// --- ÉCRITURE (C'est ici que ça change pour Multer) ---

// 1. CREATE avec Image Upload
exports.createBoutique = async (req, res) => {
  try {
    // req.body contient les champs texte (envoyés via FormData)
    // req.file contient le fichier image (si envoyé)
    
    const boutiqueObject = req.body;

    // Vérification Box
    const box = await Box.findById(boutiqueObject.id_box);
    if (box.est_loue) {
      return res.status(400).json({ message: "Ce box est déjà occupé !" });
    }

    // Gestion de l'URL de l'image
    let logoUrl = 'https://placehold.co/200x200?text=Pas+de+Logo'; // Image par défaut
    
    if (req.file) {
      // On construit l'URL complète : http://localhost:3000/uploads/mon-image.jpg
      logoUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    } else if (boutiqueObject.logo) {
       // Si l'utilisateur a quand même mis une URL texte (cas rare)
       logoUrl = boutiqueObject.logo;
    }

    const nouvelleBoutique = new Boutique({
      ...boutiqueObject,
      logo: logoUrl,
      est_ouvert: boutiqueObject.est_ouvert === 'true' // Conversion String -> Boolean car FormData envoie tout en string
    });

    await nouvelleBoutique.save();
    await Box.findByIdAndUpdate(boutiqueObject.id_box, { est_loue: true });

    res.status(201).json({ message: "Boutique créée !", boutique: nouvelleBoutique });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur création", error });
  }
};

// backend/controllers/boutiqueController.js

exports.updateBoutique = async (req, res) => {
  try {
    const boutiqueId = req.params.id;
    const userRole = req.auth.role;
    const userId = req.auth.userId;

    // 1. Chercher la boutique pour vérifier qui en est le chef
    const boutiqueAmodifier = await Boutique.findById(boutiqueId);
    if (!boutiqueAmodifier) return res.status(404).json({ message: "Boutique non trouvée" });

    // 2. LA RÈGLE D'OR : 
    // SI c'est un admin -> OK il passe.
    // SINON SI c'est le responsable -> OK il passe.
    // SINON -> 403.
    const estAdmin = userRole === 'admin';
    const estResponsable = boutiqueAmodifier.id_responsable.toString() === userId;

    if (!estAdmin && !estResponsable) {
      return res.status(403).json({ 
        message: "Accès refusé. Vous n'êtes ni admin, ni le gérant de cette boutique." 
      });
    }

    // 3. Préparer les données
    let updateData = req.file ? {
      ...req.body,
      logo: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    } : { ...req.body };

    // 4. Protection des champs sensibles pour le commercial
    if (!estAdmin) {
      delete updateData.id_box;
      delete updateData.id_responsable;
      delete updateData.id_categorie;
    }

    // 5. Exécuter la mise à jour
    const updatedBoutique = await Boutique.findByIdAndUpdate(boutiqueId, updateData, { new: true });
    res.status(200).json(updatedBoutique);

  } catch (error) {
    console.error("Erreur Update:", error);
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// 3. DELETE avec suppression du fichier image
exports.deleteBoutique = async (req, res) => {
  try {
    const boutique = await Boutique.findById(req.params.id);
    if (!boutique) return res.status(404).json({ message: "Introuvable" });

    // 1. Supprimer l'image du dossier 'uploads'
    if (boutique.logo) {
        const filename = boutique.logo.split('/uploads/')[1];
        if (filename) {
            fs.unlink(`uploads/${filename}`, () => {});
        }
    }

    // 2. Libérer le box
    await Box.findByIdAndUpdate(boutique.id_box, { est_loue: false });

    // 3. Supprimer les produits (et leurs images si tu veux faire propre plus tard)
    await Produit.deleteMany({ id_boutique: boutique._id });

    // 4. Supprimer la boutique
    await Boutique.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Boutique supprimée, Box libéré et Image effacée." });
  } catch (error) {
    res.status(500).json({ message: "Erreur suppression", error });
  }
};