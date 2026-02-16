const express = require('express');
const router = express.Router();
const boutiqueController = require('../controllers/boutiqueController');

// Route publique : Tout le monde peut voir la liste
router.get('/', boutiqueController.getAllBoutiques);

// Route publique : Tout le monde peut voir le détail d'une boutique
router.get('/:id', boutiqueController.getBoutiqueById);

// ... autres routes ...
router.get('/mes-infos/:userId', boutiqueController.getMaBoutique);

//creation boutique 
router.post('/', boutiqueController.createBoutique);

module.exports = router;