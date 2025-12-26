const sequelize = require("./config/db");

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connexion à la base réussie !");
    process.exit(0);
  } catch (error) {
    console.error("❌ Impossible de se connecter à la base :", error);
    process.exit(1);
  }
}

testConnection();
