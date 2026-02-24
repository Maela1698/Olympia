const Produit = require('../models/Produit');
const fs = require('fs'); 

// 1. RÉCUPÉRER TOUS LES PRODUITS
// backend/controllers/produitController.js

exports.getAllProduits = async (req, res) => {
  try {
    // 1. On regarde si un id_boutique est envoyé dans l'URL (ex: ?boutiqueId=123)
    const boutiqueId = req.query.boutiqueId;
    
    let filtre = {};
    if (boutiqueId) {
      filtre = { id_boutique: boutiqueId }; // On ne veut que les produits de CETTE boutique
    }

    // 2. On applique le filtre
    const produits = await Produit.find(filtre);
    
    res.status(200).json(produits);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// 2. RÉCUPÉRER UN SEUL PRODUIT
// 2. RÉCUPÉRER UN SEUL PRODUIT
exports.getProduitById = async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id)
      .populate({
        path: 'id_boutique', // On demande les infos de la boutique
        populate: {
          path: 'id_responsable', // À L'INTÉRIEUR de la boutique, on demande les infos du commercial
          model: 'User' // On précise que ça vient du modèle User
        }
      });

    if (!produit) return res.status(404).json({ message: "Introuvable" });
    
    res.status(200).json(produit);
  } catch (error) {
    res.status(500).json({ error });
  }
};
// 3. CRÉER UN PRODUIT
exports.createProduit = async (req, res) => {
  try {
    const produitObject = req.body;
    let imagesPaths = [];
    if (req.files && req.files.length > 0) {
      imagesPaths = req.files.map(file => 
        `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
      );
    }

    const produit = new Produit({
      ...produitObject,
      images: imagesPaths,
      id_boutique: produitObject.id_boutique 
    });

    await produit.save();
    res.status(201).json({ message: 'Produit créé !', produit });
  } catch (error) {
     res.status(500).json({ error });
  }
};

// 4. MODIFIER UN PRODUIT
exports.updateProduit = async (req, res) => {
  try {
    // 1. On récupère le produit actuel en base
    const ancienProduit = await Produit.findById(req.params.id);
    if (!ancienProduit) return res.status(404).json({ message: "Produit introuvable" });

    // 2. On gère la liste des images à garder (envoyée par le front)
    // Attention : via FormData, si on envoie plusieurs fois la même clé, ça peut être un tableau ou une string
    let imagesToKeep = req.body.imagesToKeep || [];
    if (typeof imagesToKeep === 'string') {
        imagesToKeep = [imagesToKeep]; 
    }

    // 3. On identifie les images à supprimer (celles qui sont en base MAIS PAS dans imagesToKeep)
    const imagesA_Supprimer = ancienProduit.images.filter(img => !imagesToKeep.includes(img));

    // 4. On supprime physiquement les fichiers rejetés
    imagesA_Supprimer.forEach(imageUrl => {
        const filename = imageUrl.split('/uploads/')[1];
        if (filename) {
            fs.unlink(`uploads/${filename}`, (err) => {
                if (err) console.log("Erreur suppression image:", err);
            });
        }
    });

    // 5. On gère les NOUVELLES images uploadées
    let nouvellesImages = [];
    if (req.files && req.files.length > 0) {
        nouvellesImages = req.files.map(file => 
            `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
        );
    }

    // 6. On fusionne : (Images gardées) + (Nouvelles images)
    const listeFinale = [...imagesToKeep, ...nouvellesImages];

    // 7. Mise à jour finale
    const produitObject = {
        ...req.body,
        images: listeFinale
    };

    // On retire imagesToKeep de l'objet car ce n'est pas un champ de la base de données
    delete produitObject.imagesToKeep;

    const produit = await Produit.findByIdAndUpdate(req.params.id, produitObject, { new: true });
    res.status(200).json({ message: "Produit modifié avec succès !", produit });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

// 5. SUPPRIMER UN PRODUIT
exports.deleteProduit = async (req, res) => {
  try {
    const produit = await Produit.findOne({ _id: req.params.id });
    if (produit && produit.images.length > 0) {
        produit.images.forEach(imageUrl => {
            const filename = imageUrl.split('/uploads/')[1];
            fs.unlink(`uploads/${filename}`, (err) => {});
        });
    }
    await Produit.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Supprimé !" });
  } catch (error) {
    res.status(500).json({ error });
  }
};