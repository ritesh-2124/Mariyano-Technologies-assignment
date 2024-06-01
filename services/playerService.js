const csvtojson = require('csvtojson');
const Player = require('../models/player');
const path = require('path');

const loadPlayers = async () => {
  const filePath = path.join(__dirname, '../data/players.csv');
  const jsonArray = await csvtojson().fromFile(filePath);
  await Player.deleteMany({});
//   console.log(jsonArray , "all players");
  await Player.insertMany(jsonArray);
};

module.exports = {
  loadPlayers,
};
