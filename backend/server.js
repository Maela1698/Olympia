require("dotenv").config();
const path = require('path');

const express = require('express');
const cors = require('cors');
const connectDB = require("./config/db");


const authRoutes = require("./routes/authRoutes");
const boutiqueRoutes = require("./routes/boutiqueRoutes");
const boxRoutes = require("./routes/boxRoutes");
const produitRoutes = require("./routes/produitRoutes");
const categorieRoutes = require("./routes/categorieRoutes");
const userRoutes = require("./routes/userRoutes");
const app = express();
const PORT = process.env.PORT || 3000;


connectDB();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Backend MEAN en marche 🚀');
});

/* ROUTES AUTH */

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use("/api/auth", authRoutes);
app.use("/api/boutiques", boutiqueRoutes);
app.use("/api/boxes", boxRoutes);
app.use("/api/produits", produitRoutes);
app.use("/api/categories", categorieRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
}); 



