require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Connexion DB
const sequelize = require("./config/db");

// Routes principales
const routes = require("./routes/index");

const app = express();

// 🔒 Origines autorisées pour CORS
const allowedOrigins = [
  "https://carnet-medical-front.onrender.com",
  "http://localhost:5173",
  "http://localhost:3000",
];

// 🔐 Middleware CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Requête depuis le serveur ou postman
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔧 Middlewares globaux
app.use(express.json()); // parse JSON
app.use(helmet());       // sécurisation HTTP headers
app.use(morgan("dev"));  // logs

// 🌐 Routes principales
app.use("/api", routes);

// ✅ Route test Render
app.get("/", (req, res) => res.send("Carnet Médical API fonctionne ✅"));

// ⚠️ Middleware global d’erreurs
app.use((err, req, res, next) => {
  console.error("❌ Erreur globale :", err.message);
  res.status(500).json({
    message: "Erreur serveur",
    error: err.message,
  });
});

// Middleware 404 pour routes non trouvées
app.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée" });
});

// 🚀 Lancement serveur
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Base de données connectée");

    app.listen(PORT, () => {
      console.log(`✅ Serveur démarré sur le port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Erreur connexion DB :", error.message);
    process.exit(1);
  }
})();
