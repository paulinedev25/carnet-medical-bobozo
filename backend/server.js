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
const carnetMedicalRoutes = require("./routes/carnetMedical.routes");
const rendezVousRoutes = require("./routes/rendezVous.routes");

const app = express();

const allowedOrigins = [
  "https://carnet-medical-front.onrender.com",
  "http://localhost:5173",
  "http://localhost:3000",
];

// 🔐 CORS (robuste + compatible navigateur)
app.use(
  cors({
    origin: (origin, callback) => {
      // Autorise Postman / Render healthcheck / SSR
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // ❗ Refus contrôlé (mais CORS toujours présent)
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔁 Preflight obligatoire
app.options("*", cors());

// 🔧 Middlewares globaux
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// 🌐 Routes API
app.use("/api", routes);
app.use("/api/resultats-examens", resultatExamenRoutes);

// ✅ 🔥 ROUTE MANQUANTE (CAUSE DU BUG)
app.use("/api/carnet-medical", carnetMedicalRoutes);

app.use("/api/rendez-vous", rendezVousRoutes);

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

// ❌ 404 final
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
    console.error("❌ Erreur DB :", error.message);
    process.exit(1);
  }
})();
