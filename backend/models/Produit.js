const mongoose = require('mongoose');

const ProduitSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: { type: String },
  prix: { type: Number, required: true },
  promo: { type: Boolean, default: false }, // Si vrai, on affiche "PROMO"
  image: { 
    type: String,
    default: 'https://placehold.co/300x300?text=Produit'
  },
  
  // Relation
  id_boutique: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Boutique',
    required: true
  }
});

module.exports = mongoose.model('Produit', ProduitSchema);