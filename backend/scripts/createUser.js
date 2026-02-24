const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Role = require("../models/Roles");

require("dotenv").config();

async function createTestUsers() {

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connecté ✅");

    // 1️⃣ On récupère les rôles
    const adminRole = await Role.findOne({ role: "admin" });
    const commercialRole = await Role.findOne({ role: "commercial" });
    const clientRole = await Role.findOne({ role: "client" });

    if (!adminRole || !commercialRole || !clientRole) {
      console.error("Erreur : certains rôles introuvables !");
      process.exit(1);
    }

    // 2️⃣ Utilisateurs tests
    const users = [
      {
        name: "Admin",
        fname: "System",
        mail: "admin@test.com",
        contact: "0340000000",
        password: await bcrypt.hash("123456", 10),
        id_role: adminRole._id
      },
      {
        name: "Commercial",
        fname: "Jean",
        mail: "commercial@test.com",
        contact: "0341111111",
        password: await bcrypt.hash("123456", 10),
        id_role: commercialRole._id
      },
      {
        name: "Client",
        fname: "Alice",
        mail: "client@test.com",
        contact: "0342222222",
        password: await bcrypt.hash("123456", 10),
        id_role: clientRole._id
      },
      {
        name: "RAKOTO",
        fname: "Hery",
        mail: "hery.com@olympia.mg",
        contact: "0340123456",
        password: await bcrypt.hash("123456", 10),
        id_role: commercialRole._id // On lui donne bien le rôle commercial
      },
      {
        name: "ANDRIA",
        fname: "Sarah",
        mail: "sarah.com@olympia.mg",
        contact: "0325567890",
        password: await bcrypt.hash("123456", 10),
        id_role: commercialRole._id
      },
      {
        name: "JEAN",
        fname: "Patrick",
        mail: "pat.com@olympia.mg",
        contact: "0331122233",
        password: await bcrypt.hash("123456", 10),
        id_role: commercialRole._id
      }
    ];

    // 3️⃣ Création ou update si déjà existant
    for (let u of users) {
      const exist = await User.findOne({ mail: u.mail });
      if (!exist) {
        await User.create(u);
        console.log("Utilisateur créé :", u.mail);
      } else {
        console.log("Utilisateur déjà existant :", u.mail);
      }
    }

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB déconnecté ✅");
  }

}

createTestUsers();
