const mongoose = require('mongoose');

const BoxSchema = new mongoose.Schema({
  nom: { 
    type: String, 
    required: true, 
    unique: true 
  }, // ex: "A-01"
  etage: { 
    type: Number, 
    required: true 
  }, // 0 pour RDC, 1 pour 1er étage
  surface: { 
    type: Number 
  }, // En m²
  est_loue: { 
    type: Boolean, 
    default: false 
  }
});

module.exports = mongoose.model('Box', BoxSchema);