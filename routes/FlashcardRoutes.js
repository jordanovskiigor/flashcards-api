const express = require('express');
const router = express.Router();
const FlashcardSet = require('../models/FlashCardSet');

// Get all sets
router.get('/', async (req, res) => {
  try {
    const sets = await FlashcardSet.find();
    res.json(sets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sets' });
  }
});

// Create a new set
router.post('/', async (req, res) => {
  try {
    const { title, description, cards } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const newSet = new FlashcardSet({ title, description, cards });
    await newSet.save();
    res.status(201).json(newSet);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create set' });
  }
});

// Update a set
router.put('/:id', async (req, res) => {
  try {
    const updated = await FlashcardSet.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Set not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update set' });
  }
});

// Delete a set
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await FlashcardSet.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Set not found' });
    res.json({ message: 'Set deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete set' });
  }
});

// Add a card to a set
router.post('/:id/cards', async (req, res) => {
  try {
    const { front, back } = req.body;
    if (!front || !back) return res.status(400).json({ error: 'Card front and back are required' });
    const set = await FlashcardSet.findById(req.params.id);
    if (!set) return res.status(404).json({ error: 'Set not found' });
    set.cards.push({ front, back });
    await set.save();
    res.status(201).json(set);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add card' });
  }
});

// Update a card in a set
router.put('/:id/cards/:cardId', async (req, res) => {
  try {
    const set = await FlashcardSet.findById(req.params.id);
    if (!set) return res.status(404).json({ error: 'Set not found' });
    const card = set.cards.id(req.params.cardId);
    if (!card) return res.status(404).json({ error: 'Card not found' });
    card.front = req.body.front ?? card.front;
    card.back = req.body.back ?? card.back;
    await set.save();
    res.json(set);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update card' });
  }
});

// Delete a card from a set
router.delete('/:id/cards/:cardId', async (req, res) => {
  try {
    const set = await FlashcardSet.findById(req.params.id);
    if (!set) return res.status(404).json({ error: 'Set not found' });
    const card = set.cards.id(req.params.cardId);
    if (!card) return res.status(404).json({ error: 'Card not found' });
    card.remove();
    await set.save();
    res.json(set);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete card' });
  }
});

module.exports = router;
