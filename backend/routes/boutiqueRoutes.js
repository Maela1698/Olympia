const express = require('express');
const router = express.Router();

// 👇 1. LES IMPORTS DOIVENT ÊTRE TOUT EN HAUT !
const boutiqueController = require('../controllers/boutiqueController');
const multer = require('../middleware/multer-config'); 

// --- ROUTES GET (Lecture) ---

// Route Publique (http://localhost:3000/api/boutiques)
router.get('/', boutiqueController.getPublicBoutiques);

// Route Admin (http://localhost:3000/api/boutiques/admin/all)
// ⚠️ IMPORTANT : Doit être AVANT la route /:id
router.get('/admin/all', boutiqueController.getAdminBoutiques);

// Route Spécifique (Mes infos)
router.get('/mes-infos/:userId', boutiqueController.getMaBoutique);

// Route Détail (http://localhost:3000/api/boutiques/65df...)
// ⚠️ Celle-ci attrape tout ce qui ressemble à un ID, donc on la met après les autres
router.get('/:id', boutiqueController.getBoutiqueById);


// --- ROUTES POST / PUT / DELETE (Écriture) ---

// Création (AVEC Multer pour l'image)
// J'ai supprimé ton autre ligne router.post qui était en doublon et sans multer
router.post('/', multer, boutiqueController.createBoutique);

// Modification (AVEC Multer aussi, si on change l'image)
router.put('/:id', multer, boutiqueController.updateBoutique);

// Suppression
router.delete('/:id', boutiqueController.deleteBoutique);

module.exports = router;