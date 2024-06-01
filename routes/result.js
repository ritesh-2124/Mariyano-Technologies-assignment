const express = require('express');
const { calculatePoints } = require('../services/resultService');
const router = express.Router();

router.post('/process-result', async (req, res) => {
  try {
    await calculatePoints();
    res.status(200).json({ message: 'Match results processed successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
