const mongoose = require('mongoose');

const ProduitSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: { type: String },
  prix: { type: Number, required: true },
  promo: { type: Boolean, default: false }, // Si vrai, on affiche "PROMO"
  images: { 
    type: [String], // Tableau de chaînes de caractères (URLs)
    default: [] 
  },
  
  // Relation
  id_boutique: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Boutique',
    required: true
  }
});

module.exports = mongoose.model('Produit', ProduitSchema);