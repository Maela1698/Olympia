const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import des modèles
const User = require('../models/User'); // Ton modèle User existant
const Role = require('../models/Roles'); // Ton modèle Role existant
const Categorie = require('../models/Categorie');
const Box = require('../models/Box');
const Boutique = require('../models/Boutique');
const Produit = require('../models/Produit');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🌱 Connexion MongoDB réussie');

    // 1. Nettoyage (On vide tout sauf les Users et Roles pour ne pas casser ton login)
    await Categorie.deleteMany({});
    await Box.deleteMany({});
    await Boutique.deleteMany({});
    await Produit.deleteMany({});
    console.log('🧹 Anciennes données supprimées (sauf Users/Roles)');

    // 2. Création des Catégories
    const catMode = await Categorie.create({ nom: 'Mode & Accessoires', image: 'https://placehold.co/100?text=Mode' });
    const catTech = await Categorie.create({ nom: 'Informatique & Tech', image: 'https://placehold.co/100?text=Tech' });
    const catFood = await Categorie.create({ nom: 'Restauration', image: 'https://placehold.co/100?text=Food' });
    console.log('✅ 3 Catégories créées');

    // 3. Création des Box (Immobilier)
    const boxes = [];
    // 5 Box au RDC
    for (let i = 1; i <= 5; i++) {
      boxes.push({ nom: `RDC-0${i}`, etage: 0, surface: 25, est_loue: false });
    }
    // 5 Box à l'étage
    for (let i = 1; i <= 5; i++) {
      boxes.push({ nom: `ET1-0${i}`, etage: 1, surface: 30, est_loue: false });
    }
    const createdBoxes = await Box.insertMany(boxes);
    console.log('✅ 10 Box créés');

    // 4. Récupération d'un commercial (Pour lui donner une boutique)
    // On cherche le rôle "commercial" d'abord
    const roleComm = await Role.findOne({ role: 'commercial' });
    // On cherche un user qui a ce rôle
    const commercant = await User.findOne({ id_role: roleComm._id });

    if (commercant) {
      // 5. Création d'une Boutique Test pour ce commercial
      const boxPrit = createdBoxes[0]; // On prend le premier box
      
      // On marque le box comme loué
      await Box.findByIdAndUpdate(boxPrit._id, { est_loue: true });

      const maBoutique = await Boutique.create({
        nom: "La Boutique de " + commercant.name,
        description: "La meilleure boutique du centre commercial !",
        id_categorie: catMode._id,
        id_box: boxPrit._id,
        id_responsable: commercant._id,
        est_ouvert: true
      });
      console.log(`✅ Boutique créée : ${maBoutique.nom}`);

      // 6. Création de Produits pour cette boutique
      await Produit.create([
        { nom: "Jean Slim", prix: 50, id_boutique: maBoutique._id, description: "Jean bleu classique" },
        { nom: "T-shirt Blanc", prix: 20, promo: true, id_boutique: maBoutique._id, description: "Coton bio" },
        { nom: "Casquette", prix: 15, id_boutique: maBoutique._id, description: "Style urbain" }
      ]);
      console.log('✅ 3 Produits ajoutés');

    } else {
      console.log('⚠️ Pas de commercial trouvé dans la base Users. Créez-en un via le script précédent.');
    }

    console.log('🚀 Seed terminé avec succès !');
    process.exit();

  } catch (error) {
    console.error('❌ Erreur seed:', error);
    process.exit(1);
  }
};

seedData();