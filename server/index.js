require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const conversionsRoute = require('./routes/conversions');

// Use routes
app.use('/api', conversionsRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 