const Produit = require('../models/Produit');
const fs = require('fs'); // Pour supprimer les images

// 1. Récupérer TOUS les produits
exports.getAllProduits = async (req, res) => {
  try {
    const produits = await Produit.find().populate('id_boutique');
    res.status(200).json(produits);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// 2. Récupérer UN produit par ID
exports.getProduitById = async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id).populate('id_boutique');
    if (!produit) return res.status(404).json({ message: "Produit introuvable" });
    res.status(200).json(produit);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// 3. CRÉER un produit (Avec Multer Array)
exports.createProduit = async (req, res) => {
  try {
    const produitObject = req.body;
    
    // Gestion des images multiples (req.files est un tableau)
    let imagesPaths = [];
    if (req.files && req.files.length > 0) {
      imagesPaths = req.files.map(file => 
        `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
      );
    }

    const produit = new Produit({
      ...produitObject,
      images: imagesPaths // On sauvegarde le tableau d'URLs
    });

    await produit.save();
    res.status(201).json({ message: 'Produit créé !', produit });
  } catch (error) {
     console.error(error);
     res.status(500).json({ message: "Erreur création", error });
  }
};

// 4. MODIFIER un produit
exports.updateProduit = async (req, res) => {
  try {
    const produitObject = { ...req.body };

    // Si de nouvelles images sont envoyées
    if (req.files && req.files.length > 0) {
       const newImages = req.files.map(file => 
         `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
       );
       // On remplace les anciennes images (ou on peut les ajouter avec push)
       produitObject.images = newImages;
    }

    const produit = await Produit.findByIdAndUpdate(
        req.params.id, 
        produitObject, 
        { new: true }
    );
    res.status(200).json(produit);
  } catch (error) {
    res.status(500).json({ message: "Erreur modification", error });
  }
};

// 5. SUPPRIMER un produit
exports.deleteProduit = async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id);
    if (!produit) return res.status(404).json({ message: "Introuvable" });

    // Optionnel : Supprimer les fichiers physiques du dossier uploads
    if (produit.images && produit.images.length > 0) {
        produit.images.forEach(imageUrl => {
            const filename = imageUrl.split('/uploads/')[1];
            fs.unlink(`uploads/${filename}`, (err) => {
                if (err) console.log("Image non trouvée ou erreur suppresssion:", filename);
            });
        });
    }

    await Produit.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Produit supprimé." });
  } catch (error) {
    res.status(500).json({ message: "Erreur suppression", error });
  }
};