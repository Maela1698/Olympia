const mongoose = require("mongoose");
const Role = require("../models/Roles");
require("dotenv").config();

async function initRoles() {

  try {

    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connecté ✅");

    const roles = ["admin", "commercial", "client"];

    for (let r of roles) {

      const exist = await Role.findOne({ role: r });

      if (!exist) {
        await Role.create({ role: r });
        console.log("Rôle créé :", r);
      } else {
        console.log("Rôle déjà existant :", r);
      }

    }

  } catch (err) {
    console.error(err);
  } finally {
    // Déconnecter proprement
    await mongoose.disconnect();
    console.log("MongoDB déconnecté ✅");
  }

}

initRoles();
