const express = require('express');
const router = express.Router();
const commandeController = require('../controllers/commandeController');

// Route POST pour créer une commande : http://localhost:3000/api/commandes
router.post('/', commandeController.creerCommande);
// Route GET pour voir les ventes d'une boutique : http://localhost:3000/api/commandes/boutique/ID_DE_LA_BOUTIQUE
router.get('/boutique/:boutiqueId', commandeController.getVentesParBoutique);

module.exports = router;