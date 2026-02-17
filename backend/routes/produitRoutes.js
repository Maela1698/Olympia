const express = require('express');
const router = express.Router();

// 👇 IMPORT IMPORTANT : À METTRE TOUT EN HAUT !
const produitController = require('../controllers/produitController');
const multer = require('../middleware/multer-config'); 

// --- ROUTES ---

// 1. Création de produit (Avec images multiples)
// Note : multer.array permet d'envoyer plusieurs images (max 5 ici)
router.post('/', multer.array, produitController.createProduit);

// 2. Lecture (Liste des produits)
// Attention : assure-toi que cette fonction existe bien dans ton produitController
router.get('/', produitController.getAllProduits);

// 3. Lecture (Un seul produit)
router.get('/:id', produitController.getProduitById);

// 4. Modification (Si on veut changer l'image ou le prix)
router.put('/:id', multer.array, produitController.updateProduit);

// 5. Suppression
router.delete('/:id', produitController.deleteProduit);

module.exports = router;