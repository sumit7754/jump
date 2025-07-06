const express = require('express');
const router = express.Router();
const conversionsController = require('../controllers/conversionsController');

router.get('/conversions',conversionsController.getAllConversions);
router.post('/conversions',conversionsController.saveConversion);

module.exports = router;