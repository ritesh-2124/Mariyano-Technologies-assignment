const Team = require('../models/team');
const Player = require('../models/player');

const createTeam = async (teamData) => {
    try {
        
  // Validate team
  if (teamData.players.length !== 11) {
    throw new Error('A team must have 11 players.');
  }
// console.log(teamData.players , "no players");
  const teamPlayers = await Player.find({ Player: { $in: teamData.players } });
  console.log(teamPlayers , teamPlayers.length, "no players");
  if (teamPlayers.length !== 11) {
    throw new Error('Invalid players selected.');
  }

  const teamCount = teamPlayers.reduce((acc, player) => {
    console.log(player.Team , "Team")
    acc[player.Team] = (acc[player.Team] || 0) + 1;
    return acc;
  }, {});

  if (Object.values(teamCount).some(count => count > 10)) {
    throw new Error('A team can have a maximum of 10 players from any one team.');
  }

  // Validate captain and vice-captain
  if (!teamData.players.includes(teamData.captain)) {
    throw new Error('Captain must be one of the selected players.');
  }

  if (!teamData.players.includes(teamData.viceCaptain)) {
    throw new Error('Vice-captain must be one of the selected players.');
  }

  // Create team
  const newTeam = new Team(teamData);
  await newTeam.save();
  return newTeam;

    } catch (error) {
        throw new Error(error.message);
    }
};

const getAllTeams = async () => {
    try {
        const teams = await Team.find({}).sort({ points: -1 }).exec();
        const maxPoints = teams.length ? teams[0].points : 0;
        const topTeams = teams.filter(team => team.points === maxPoints);
    
        return {
          teams,
          winners: topTeams,
        };
      } catch (error) {
        return { error: 'Error retrieving teams', status: 500, message: error.message };
      }
};

module.exports = {
  createTeam,
  getAllTeams,
};
