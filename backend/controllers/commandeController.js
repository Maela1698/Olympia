const Commande = require('../models/Commande');
const Produit = require('../models/Produit'); // On a besoin du modèle Produit pour changer le stock !

exports.creerCommande = async (req, res) => {
  try {
    // 1. On récupère les infos envoyées par le panier Angular
    const { id_client, articles, montant_total } = req.body;

    // 2. On crée la nouvelle commande avec le statut "Payée"
    const nouvelleCommande = new Commande({
      id_client: id_client,
      articles: articles,
      montant_total: montant_total,
      statut: 'Payée' 
    });

    const commandeSauvegardee = await nouvelleCommande.save();

    // 3. LA MAGIE DU STOCK : On met à jour chaque produit acheté
    // On utilise une boucle for...of pour pouvoir utiliser "await" correctement
    for (let article of articles) {
      await Produit.findByIdAndUpdate(
        article.id_produit, 
        { $inc: { stock: -article.quantite } } // $inc est une fonction MongoDB qui fait une soustraction automatique !
      );
    }

    // 4. On répond à Angular que tout est parfait
    res.status(201).json({ 
      message: "Commande validée et stock mis à jour avec succès !", 
      commandeId: commandeSauvegardee._id // On renvoie l'ID pour le reçu PDF plus tard
    });

  } catch (error) {
    console.error("Erreur création commande:", error);
    res.status(500).json({ message: "Erreur serveur lors de la commande", error });
  }
};
// Récupérer l'historique des ventes pour UNE boutique spécifique
exports.getVentesParBoutique = async (req, res) => {
  try {
    const boutiqueId = req.params.boutiqueId;

    // 1. On cherche toutes les commandes qui contiennent au moins un article de cette boutique
    const commandes = await Commande.find({ "articles.id_boutique": boutiqueId })
                                    .populate('id_client', 'nom fname name mail email')
                                    .sort({ date_commande: -1 }); // Du plus récent au plus ancien

    // 2. LE FILTRE DE SÉCURITÉ : On nettoie les données pour ne garder QUE les articles de ce commercial
    const ventesNettoyees = commandes.map(cmd => {
      // On filtre le tableau d'articles
      const articlesDeLaBoutique = cmd.articles.filter(art => art.id_boutique.toString() === boutiqueId);
      
      // On recalcule le total gagné UNIQUEMENT pour cette boutique
      const totalGagne = articlesDeLaBoutique.reduce((somme, art) => somme + (art.prix_unitaire * art.quantite), 0);
      
      return {
        _id: cmd._id,
        date_commande: cmd.date_commande,
        client: cmd.id_client,
        articles: articlesDeLaBoutique,
        total_gagne: totalGagne
      };
    });

    res.status(200).json(ventesNettoyees);

  } catch (error) {
    console.error("Erreur historique ventes:", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des ventes" });
  }
};