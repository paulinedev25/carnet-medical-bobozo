import cors from "cors";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Connexion DB
const sequelize = require("./config/db");

const app = express();
const routes = require("./routes/index");
const resultatExamenRoutes = require("./routes/resultatExamen.routes"); // ✅ ajout

const allowedOrigins = [
  "https://carnet-medical-front.onrender.com",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Autoriser Postman / Render / serveur
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

// Important pour Render
app.options("*", cors());

// 🔧 Middlewares globaux
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// 🌐 Routes principales
app.use("/api", routes);

// 🔬 Résultats examens
app.use("/api/resultats-examens", resultatExamenRoutes); // ✅ nouvelle route

// ✅ Test route racine
app.get("/", (req, res) => res.send("Carnet Médical API fonctionne ✅"));

// ⚠️ Gestion erreurs non gérées (middleware global)
app.use((err, req, res, next) => {
  console.error("Erreur globale :", err);
  res.status(500).json({ message: "Erreur serveur", error: err.message });
});

// 🚀 Lancement du serveur avec connexion DB
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Base de données connectée");

    app.listen(PORT, () =>
      console.log(`✅ Serveur démarré sur le port ${PORT}`)
    );
  } catch (error) {
    console.error("❌ Erreur DB :", error.message);
    process.exit(1);
  }
})();
