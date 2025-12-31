require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Connexion DB
const sequelize = require("./config/db");

// Routes
const routes = require("./routes/index");
const resultatExamenRoutes = require("./routes/resultatExamen.routes");

const app = express();

const allowedOrigins = [
  "https://carnet-medical-front.onrender.com",
  "http://localhost:5173",
  "http://localhost:3000",
];

// 🔐 CORS (UNE SEULE FOIS, BIEN CONFIGURÉ)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔧 Middlewares globaux
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// 🌐 Routes principales
app.use("/api", routes);
app.use("/api/resultats-examens", resultatExamenRoutes);

// ✅ Route test Render
app.get("/", (req, res) =>
  res.send("Carnet Médical API fonctionne ✅")
);

// ⚠️ Middleware global d’erreurs
app.use((err, req, res, next) => {
  console.error("Erreur globale :", err.message);
  res.status(500).json({
    message: "Erreur serveur",
    error: err.message,
  });
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
    console.error("❌ Erreur DB :", error.message);
    process.exit(1);
  }
})();
