const Box = require('../models/Box');

exports.getAllBoxes = async (req, res) => {
  try {
    const boxes = await Box.find();
    res.status(200).json(boxes);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.createBox = async (req, res) => {
    try {
        const newBox = await Box.create(req.body);
        res.status(201).json(newBox);
    } catch (error) {
        res.status(400).json({ message: "Erreur création", error });
    }
};