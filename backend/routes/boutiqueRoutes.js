const express = require('express');
const router = express.Router();
const boutiqueController = require('../controllers/boutiqueController');
const upload = require('../middleware/multer-config'); 
const auth = require('../middleware/auth'); 

// --- ROUTES GET (Lecture) ---
router.get('/', boutiqueController.getPublicBoutiques);
router.get('/admin/all', boutiqueController.getAdminBoutiques);
router.get('/mes-infos/:userId', boutiqueController.getMaBoutique);
router.get('/:id', boutiqueController.getBoutiqueById);
// Route : /api/boutiques/responsable/:vendeurId
router.get('/responsable/:vendeurId', boutiqueController.getBoutiquesParResponsable);

// --- ROUTES ECRITURE ---

// 1. CRÉATION (Admin ou libre selon ton choix)
router.post('/', upload.single('image'), boutiqueController.createBoutique);

// 2. MODIFICATION (C'est ICI la correction)
// 👇 On met 'auth' AVANT 'upload'
// Le serveur fait : Vérif Token (auth) -> Gestion Fichier (upload) -> Logique Métier (controller)
router.put('/:id', auth, upload.single('image'), boutiqueController.updateBoutique);

// 3. SUPPRESSION
router.delete('/:id', auth, boutiqueController.deleteBoutique); // Ajoute auth ici aussi par sécurité

module.exports = router;