const express = require('express');
const { createTeam, getAllTeams } = require('../services/teamService');
const router = express.Router();

router.post('/add-team', async (req, res) => {
  try {
    const newTeam = await createTeam(req.body);
    res.status(201).json(newTeam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/team-result', async (req, res) => {
  try {
    const teams = await getAllTeams();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
