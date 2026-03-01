const mongoose = require('mongoose');

const CommandeSchema = new mongoose.Schema({
  // 1. Qui a acheté ?
  id_client: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // 2. Qu'est-ce qu'il a acheté ? (Un tableau car il y a plusieurs produits dans le panier)
  articles: [{
    id_produit: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit', required: true },
    nom_produit: { type: String, required: true },
    id_boutique: { type: mongoose.Schema.Types.ObjectId, ref: 'Boutique', required: true },
    quantite: { type: Number, required: true },
    prix_unitaire: { type: Number, required: true }
  }],
  
  // 3. Combien il a payé au total ?
  montant_total: { 
    type: Number, 
    required: true 
  },
  
  // 4. L'état de la commande
  statut: { 
    type: String, 
    enum: ['En attente', 'Payée', 'Livrée', 'Annulée'],
    default: 'Payée' // Comme on simule un paiement direct, elle est payée tout de suite !
  },
  
  // 5. Quand ?
  date_commande: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Commande', CommandeSchema);