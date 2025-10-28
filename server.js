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

// Health route
app.get('/', (req, res) => res.json({ status: 'ok', service: 'flashcard-api' }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start server with graceful shutdown
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

function shutdown(signal) {
  console.log(`Received ${signal}. Closing server...`);
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('Mongo connection closed. Exiting.');
      process.exit(0);
    });
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
