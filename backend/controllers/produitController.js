const Produit = require('../models/Produit');

// 1. CRÉER un produit
exports.createProduit = async (req, res) => {
  try {
    const nouveauProduit = new Produit(req.body); // req.body contient nom, prix, id_boutique...
    await nouveauProduit.save();
    res.status(201).json(nouveauProduit);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la création", error });
  }
};

// 2. MODIFIER un produit
exports.updateProduit = async (req, res) => {
  try {
    const produitModifie = await Produit.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true } // Renvoie l'objet après modification
    );
    res.status(200).json(produitModifie);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la modification", error });
  }
};

// 3. SUPPRIMER un produit
exports.deleteProduit = async (req, res) => {
  try {
    await Produit.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression", error });
  }
};