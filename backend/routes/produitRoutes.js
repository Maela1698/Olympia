const express = require('express');
const router = express.Router();
const produitController = require('../controllers/produitController');

// On importe notre configuration corrigée
// J'ai renommé la variable 'upload' pour que ce soit plus logique
const upload = require('../middleware/multer-config'); 


// --- ROUTES ---

// 1. CRÉATION : On utilise upload.array('images', 5)
// 'images' = le nom du champ dans le formulaire Angular
// 5 = nombre max de photos
router.post('/', upload.array('images', 5), produitController.createProduit);

// 2. LECTURE
router.get('/', produitController.getAllProduits);
router.get('/:id', produitController.getProduitById);

// 3. MODIFICATION (On accepte aussi de nouvelles images)
router.put('/:id', upload.array('images', 5), produitController.updateProduit);

// 4. SUPPRESSION
router.delete('/:id', produitController.deleteProduit);

module.exports = router;