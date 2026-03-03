const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Role = require("../models/Roles");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { mail, password } = req.body;

    // Validation
    if (!mail || !password) {
      return res.status(400).json({ msg: "Veuillez remplir tous les champs" });
    }

    // Recherche utilisateur + Rôle
    const user = await User.findOne({ mail }).populate("id_role");

    if (!user) return res.status(404).json({ msg: "Utilisateur non trouvé" });

    // Vérification du hash
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ msg: "Mot de passe incorrect" });

    // Vérifier que le rôle existe
    const userRole = user.id_role ? user.id_role.role : "client"; 

    // Création Token
   const token = jwt.sign(
      { 
        userId: user._id,
        role: userRole 
      },
      process.env.JWT_SECRET || 'monsecret', 
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
