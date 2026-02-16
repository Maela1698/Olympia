const mongoose = require('mongoose');

const BoutiqueSchema = new mongoose.Schema({
  nom: { type: String, required: true, unique: true },
  description: { type: String },
  logo: { 
    type: String,
    default: 'https://placehold.co/200x200?text=Logo' 
  },
  horaires: { type: String, default: "8h - 18h" },
  est_ouvert: { type: Boolean, default: true },
  
  // Clés étrangères (Relations)
  id_categorie: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Categorie',
    required: true
  },
  id_box: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Box',
    required: true,
    unique: true // Une boutique ne peut occuper qu'un seul box
  },
  id_responsable: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Boutique', BoutiqueSchema);