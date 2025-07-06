const db = require('../db');

// Get all sample items
exports.getSampleItems = async (req, res) => {
  try {
    const sampleItems = db.prepare('SELECT * FROM sample_items').all();
    res.json(sampleItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}; 