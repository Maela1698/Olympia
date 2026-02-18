const express = require('express');
const router = express.Router();
const boxController = require('../controllers/boxController');

router.get('/', boxController.getAllBoxes);
router.post('/', boxController.createBox);

module.exports = router;