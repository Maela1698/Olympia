const Boutique = require('../models/Boutique');
const Produit = require('../models/Produit');
const Categorie = require('../models/Categorie');
const Box = require('../models/Box');

exports.getAllBoutiques = async (req, res) => {
    try {
        console.log("Tentative de récupération des boutiques..."); // Log de debug
        
        const boutiques = await Boutique.find()
                                        .populate('id_categorie', 'nom image')
                                        .populate('id_box', 'nom etage');
        
        console.log("Boutiques trouvées :", boutiques.length); // Log de debug
        res.status(200).json(boutiques);
    } catch (error) {
        // 👇 C'EST ICI QU'ON VA VOIR LA VRAIE ERREUR DANS LE TERMINAL
        console.error("❌ ERREUR BACKEND :", error); 
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// 1. Récupérer toutes les boutiques (Pour la page d'accueil)
exports.getAllBoutiques = async (req, res) => {
  try {
    // .populate('id_categorie') permet de remplacer l'ID bizarre par le vrai nom de la catégorie (ex: "Mode")
    const boutiques = await Boutique.find()
                                    .populate('id_categorie', 'nom image')
                                    .populate('id_box', 'nom etage');
    
    res.status(200).json(boutiques);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// 2. Récupérer une seule boutique avec ses produits (Pour le détail)
exports.getBoutiqueById = async (req, res) => {
  try {
    const boutique = await Boutique.findById(req.params.id).populate('id_categorie');
    
    if (!boutique) return res.status(404).json({ message: "Boutique introuvable" });

    // On récupère aussi les produits de cette boutique
    const produits = await Produit.find({ id_boutique: boutique._id });

    res.status(200).json({ boutique, produits });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};



exports.getMaBoutique = async (req, res) => {
  try {
    const userId = req.params.userId; 

    // Trouve la boutique liée à ce commerçant
    const boutique = await Boutique.findOne({ id_responsable: userId })
                                   .populate('id_box')
                                   .populate('id_categorie');

    if (!boutique) {
      return res.status(404).json({ message: "Aucune boutique trouvée." });
    }

    // Trouve les produits de cette boutique
    const produits = await Produit.find({ id_boutique: boutique._id });

    res.status(200).json({ boutique, produits });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

//creation boutika 
exports.createBoutique = async (req, res) => {
  try {
    const { nom, description, id_responsable, id_box, id_categorie } = req.body;

    // 1. Vérifier si le box est déjà loué (Sécurité doublon)
    const box = await Box.findById(id_box);
    if (box.est_loue) {
      return res.status(400).json({ message: "Ce box est déjà occupé !" });
    }

    // 2. Créer la boutique
    const nouvelleBoutique = new Boutique({
      nom,
      description,
      id_responsable,
      id_box,
      id_categorie,
      est_ouvert: false
    });

    await nouvelleBoutique.save();

    // 3. Mettre à jour le Box pour dire qu'il est loué
    await Box.findByIdAndUpdate(id_box, { est_loue: true });

    res.status(201).json({ message: "Boutique créée et Box assigné !", boutique: nouvelleBoutique });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création", error });
  }
};