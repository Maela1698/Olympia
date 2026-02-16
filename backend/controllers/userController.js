const User = require('../models/User');

// Récupérer uniquement les commerciaux
exports.getCommercials = async (req, res) => {
  try {
    // On cherche les users qui ont le rôle 'commercial' (ou l'ID du rôle si tu utilises des ID)
    // IMPORTANT : Adapte 'commercial' selon comment tu as stocké les rôles dans ta BDD (string ou ID)
    // Si tu utilises des ID pour les rôles, il faudra faire un populate ou chercher par l'ID du rôle commercial
    
    // Option simple si tu as stocké le nom du rôle :
    // const users = await User.find({ role: 'commercial' }).select('-password');
    
    // Si tu as un système User <-> Role avec ID, on récupère tout pour l'instant :
    const users = await User.find().populate('id_role');
    
    // On filtre en JS pour être sûr (si tu as une table Roles séparée)
    const commerciaux = users.filter(u => u.id_role?.role === 'commercial');

    res.status(200).json(commerciaux);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};