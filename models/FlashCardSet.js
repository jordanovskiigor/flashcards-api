const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  front: String,
  back: String,
});

const setSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  cards: [cardSchema],
}, { timestamps: true });

module.exports = mongoose.model('FlashcardSet', setSchema);
