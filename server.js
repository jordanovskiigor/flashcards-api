const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const flashcardRoutes = require('./routes/FlashcardRoutes.js');

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/sets', flashcardRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
