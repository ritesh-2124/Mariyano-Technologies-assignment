const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  Player: String,
  Team: String,
  Role: String,
  points: { type: Number, default: 0 },
  totalRuns: { type: Number, default: 0 },
  maidenOvers: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  catches: { type: Number, default: 0 }
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
