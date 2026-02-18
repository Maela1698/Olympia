const Box = require('../models/Box');

// 1. LIRE TOUT
exports.getAllBoxes = async (req, res) => {
  try {
    const boxes = await Box.find();
    res.status(200).json(boxes);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// 2. CRÉER
exports.createBox = async (req, res) => {
    try {
        const newBox = await Box.create(req.body);
        res.status(201).json(newBox);
    } catch (error) {
        res.status(400).json({ message: "Erreur création (Nom déjà pris ?)", error });
    }
};

// 3. MODIFIER (Nouveau)
exports.updateBox = async (req, res) => {
    try {
        const updatedBox = await Box.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } // Renvoie la nouvelle version
        );
        res.status(200).json(updatedBox);
    } catch (error) {
        res.status(500).json({ message: "Erreur modification", error });
    }
};

// 4. SUPPRIMER (Nouveau)
exports.deleteBox = async (req, res) => {
    try {
        const box = await Box.findById(req.params.id);
        
        // Sécurité : Impossible de supprimer si loué
        if (box.est_loue) {
            return res.status(400).json({ message: "Impossible de supprimer : Ce box est occupé !" });
        }

        await Box.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Box supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur suppression", error });
    }
};