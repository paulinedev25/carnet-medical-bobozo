// create-admin.js
const db = require("./models");
const bcrypt = require("bcrypt");

(async () => {
  try {
    // 🔄 Synchroniser les tables (création si manquantes)
    await db.sequelize.sync({ alter: true });
    console.log("✅ Tables synchronisées !");

    // 🔑 Données de l'admin
    const adminData = {
      noms: "Super Admin",
      email: "admin@example.com",
      mot_de_passe: await bcrypt.hash("admin", 10),
      role: "admin",
      statut: "actif",
      date_creation: new Date(),
    };

    // Vérifier si un admin existe déjà
    const existingAdmin = await db.Utilisateur.findOne({ where: { email: adminData.email } });
    if (existingAdmin) {
      console.log("⚠️ Admin déjà existant :", adminData.email);
      process.exit(0);
    }

    // Créer l'admin
    const admin = await db.Utilisateur.create(adminData);
    console.log("✅ Admin créé avec succès :", admin.email);

    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur création admin :", error);
    process.exit(1);
  }
})();
