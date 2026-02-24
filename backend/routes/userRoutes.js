const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/commercials', userController.getCommercials);

module.exports = router;