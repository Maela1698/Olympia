const Categorie = require('../models/Categorie');


exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Categorie.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// 2. CRÉER
exports.createCategorie = async (req, res) => {
  try {
    const nouvelleCat = new Categorie(req.body);
    await nouvelleCat.save();
    res.status(201).json(nouvelleCat);
  } catch (error) {
    res.status(400).json({ message: "Erreur création", error });
  }
};

// 3. MODIFIER
exports.updateCategorie = async (req, res) => {
  try {
    const catModifiee = await Categorie.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.status(200).json(catModifiee);
  } catch (error) {
    res.status(400).json({ message: "Erreur modification", error });
  }
};

// 4. SUPPRIMER
exports.deleteCategorie = async (req, res) => {
  try {
    await Categorie.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Catégorie supprimée" });
  } catch (error) {
    res.status(500).json({ message: "Erreur suppression", error });
  }
};