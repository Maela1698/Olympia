const express = require('express');
const router = express.Router();
const boxController = require('../controllers/boxController');

router.get('/', boxController.getAllBoxes);
router.post('/', boxController.createBox);
router.put('/:id', boxController.updateBox);   
router.delete('/:id', boxController.deleteBox); 

module.exports = router;