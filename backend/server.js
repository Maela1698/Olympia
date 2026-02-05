require("dotenv").config();

const express = require('express');
const cors = require('cors');
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 3000;

// Connexion MongoDB Atlas
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Route test
app.get('/', (req, res) => {
  res.send('Backend MEAN en marche 🚀');
});

// Lancer serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
