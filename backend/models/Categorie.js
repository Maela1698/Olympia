const mongoose = require('mongoose');

const CategorieSchema = new mongoose.Schema({
  nom: { 
    type: String, 
    required: true, 
    unique: true // Impossible d'avoir 2 catégories "Sport"
  },
  image: {
    type: String, // URL d'une image pour faire joli sur l'accueil
    default: 'https://placehold.co/100x100?text=Cat'
  }
});

module.exports = mongoose.model('Categorie', CategorieSchema);