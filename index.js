const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const teamRoutes = require('./routes/team.js');
const resultRoutes = require('./routes/result.js');
const playerService = require('./services/playerService.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Connected to MongoDB');
 await playerService.loadPlayers();  // Load player data on startup
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

app.use('/api/teams', teamRoutes);
app.use('/api/results', resultRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
