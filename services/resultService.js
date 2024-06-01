const Team = require('../models/team');
const Player = require('../models/player');
const matchData = require('../data/match.json');

const calculatePoints = async () => {
 try {
    const teams = await Team.find({});
    const players = await Player.find({});
  
    // Clear previous points
    for (const player of players) {
      player.points = 0;
      player.totalRuns = 0;
      player.maidenOvers = 0;
      player.wickets = 0;
      player.catches = 0;
      await player.save();
    }
  
    // Process match data to calculate individual player points
    for (const ball of matchData) {
      const {
        batter,
        bowler,
        batsman_run,
        total_run,
        isWicketDelivery,
        player_out,
        kind,
        fielders_involved
      } = ball;
  
      const batsmanPlayer = players.find(p => p.Player === batter);
      const bowlerPlayer = players.find(p => p.Player === bowler);
  
      // Batting Points
      if (batsmanPlayer) {
          console.log(batsmanPlayer , "batsman player");
        batsmanPlayer.points += batsman_run;
        if (batsman_run === 4) batsmanPlayer.points += 1; // Boundary Bonus
        if (batsman_run === 6) batsmanPlayer.points += 2; // Six Bonus
  
        batsmanPlayer.totalRuns += batsman_run;
        if (batsmanPlayer.totalRuns >= 30) batsmanPlayer.points += 4; // 30 Run Bonus
        if (batsmanPlayer.totalRuns >= 50) batsmanPlayer.points += 8; // Half-century Bonus
        if (batsmanPlayer.totalRuns >= 100) batsmanPlayer.points += 16; // Century Bonus
  
        if (isWicketDelivery && (batsmanPlayer.Role === 'BATTER' || batsmanPlayer.Role === 'WICKETKEEPER' || batsmanPlayer.Role === 'ALL-ROUNDER') && batsmanPlayer.totalRuns === 0) {
          batsmanPlayer.points -= 2; // Dismissal for a duck
        }
  
        await batsmanPlayer.save();
      }
  
      // Bowling Points
      if (bowlerPlayer) {
        if (total_run === 0) {
          bowlerPlayer.maidenOvers += 1;
          if (bowlerPlayer.maidenOvers % 6 === 0) bowlerPlayer.points += 12; // Maiden Over Bonus
        }
  
        if (isWicketDelivery && kind !== 'run out') {
          bowlerPlayer.points += 25; // Wicket Points
          if (kind === 'bowled' || kind === 'lbw') bowlerPlayer.points += 8; // Bonus for bowled or lbw
          bowlerPlayer.wickets += 1;
          if (bowlerPlayer.wickets === 3) bowlerPlayer.points += 4; // 3 Wicket Bonus
          if (bowlerPlayer.wickets === 4) bowlerPlayer.points += 8; // 4 Wicket Bonus
          if (bowlerPlayer.wickets === 5) bowlerPlayer.points += 16; // 5 Wicket Bonus
        }
  
        await bowlerPlayer.save();
      }
  
      // Fielding Points
      if (isWicketDelivery && player_out !== 'NA') {
        const fielders = fielders_involved.split(',').map(f => f.trim());
        for (const fielder of fielders) {
          const fielderPlayer = players.find(p => p.Player === fielder);
          if (fielderPlayer) {
            if (kind === 'catch') fielderPlayer.points += 8; // Catch Points
            fielderPlayer.catches += 1;
            if (fielderPlayer.catches === 3) fielderPlayer.points += 4; // 3 Catch Bonus
  
            if (kind === 'stumped') fielderPlayer.points += 12; // Stumping Points
            if (kind === 'run out') fielderPlayer.points += 6; // Run out Points
  
            await fielderPlayer.save();
          }
        }
      }
    }
  
    // Calculate total team points
    for (const team of teams) {
      let totalPoints = 0;
  
      // Calculate points for each player in the team
      for (const playerName of team.players) {
        const player = players.find(p => p.Player === playerName);
        if (player) {
          totalPoints += player.points;
        }
      }
  
      // Add captain and vice-captain bonus
      const captain = players.find(p => p.Player === team.captain);
      const viceCaptain = players.find(p => p.Player === team.viceCaptain);
      if (captain) {
        totalPoints += captain.points * 2; // 2x points for captain
      }
      if (viceCaptain) {
        totalPoints += viceCaptain.points * 1.5; // 1.5x points for vice-captain
      }
  
      team.points = totalPoints;
      await team.save();
    }
 } catch (error) {
   return { error: 'Error calculating points' , status: 500  , message: error.message };
 }
};

module.exports = {
  calculatePoints,
};
