const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Role = require("../models/Roles");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { mail, password } = req.body;

    // 1. Validation basique (Évite le crash si body vide)
    if (!mail || !password) {
      return res.status(400).json({ msg: "Veuillez remplir tous les champs" });
    }

    // 2. Recherche utilisateur + Rôle
    // On garde le password ici car on en a besoin pour bcrypt
    const user = await User.findOne({ mail }).populate("id_role");

    if (!user) return res.status(404).json({ msg: "Utilisateur non trouvé" });

    // 3. Vérification du hash
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ msg: "Mot de passe incorrect" });

    // 4. Sécurité : Vérifier que le rôle existe (évite le crash server)
    const userRole = user.id_role ? user.id_role.role : "client"; 

    // 5. Création Token
   const token = jwt.sign(
      { 
        userId: user._id, // 👈 On utilise 'userId' (très important !)
        role: userRole 
      },
      process.env.JWT_SECRET || 'monsecret', // 👈 Utilise la même clé que dans auth.js
      { expiresIn: "1h" }
    );

    // 6. Réponse
    res.status(200).json({ 
        token, 
        user: {
            id: user._id,
            name: user.name,
            role: userRole,
            email: user.mail
        }
    });

    // 6. Réponse propre
    res.status(200).json({ 
        token, 
        user: {
            id: user._id,
            name: user.name,
            role: userRole,
            email: user.mail
        }
    });

  } catch (err) {
    console.error("Erreur Login:", err);
    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
};
