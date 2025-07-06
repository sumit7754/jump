const express = require('express');
const router = express.Router();
const sampleController = require('../controllers/sampleController');

// GET /api/sample - Get all sample items
router.get('/sample', sampleController.getSampleItems);

module.exports = router; 