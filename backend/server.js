require("dotenv").config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const connectDB = require("./config/db");

// 1. IMPORT DES ROUTES
const authRoutes = require("./routes/authRoutes");
const boutiqueRoutes = require("./routes/boutiqueRoutes");
const boxRoutes = require("./routes/boxRoutes");
const produitRoutes = require("./routes/produitRoutes");
const categorieRoutes = require("./routes/categorieRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// 2. CONNEXION BDD
connectDB();

// 3. CONFIGURATION CORS
// Note : Vérifiez bien que l'URL Netlify est exacte (sans / à la fin)
const allowedOrigins = [
  'https://olympia-front.netlify.app', 
  'http://localhost:4200'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Autorise les requêtes sans origine (comme Postman ou les serveurs de rendu)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Bloqué par CORS : Origine non autorisée'));
    }
  },
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Utile si vous utilisez des cookies ou des sessions plus tard
};

// 4. MIDDLEWARES GLOBAUX
app.use(cors(corsOptions)); // Toujours mettre CORS en premier
app.use(express.json());    // Pour parser le JSON
app.use(express.urlencoded({ extended: true })); // Utile pour les formulaires classiques

// 5. FICHIERS STATIQUES (Images, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 6. ROUTES
app.get('/', (req, res) => {
  res.send('Backend MEAN en marche');
});

app.use("/api/auth", authRoutes);
app.use("/api/boutiques", boutiqueRoutes);
app.use("/api/boxes", boxRoutes);
app.use("/api/produits", produitRoutes);
app.use("/api/categories", categorieRoutes);
app.use("/api/users", userRoutes);

// 7. GESTION DES ERREURS (Optionnel mais recommandé)
// Pour éviter que le serveur crash en affichant une erreur brute
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Une erreur interne est survenue" });
});

// 8. LANCEMENT DU SERVEUR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  // Sur Render, l'adresse sera dynamique, donc on affiche juste le port
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});