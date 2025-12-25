// routes/consultation.routes.js
const express = require("express");
const router = express.Router();
const consultationController = require("../controllers/consultation.controller");
const auth = require("../middlewares/auth.middleware");

// ➕ Créer une consultation (admin, médecin, réceptionniste)
router.post(
  "/",
  auth(["admin", "medecin", "receptionniste"]),
  consultationController.createConsultation
);

// 📋 Liste des consultations (admin, médecin, réceptionniste)
router.get(
  "/",
  auth(["admin", "medecin", "receptionniste"]),
  consultationController.getAllConsultations
);

// 📊 Dashboard consultations (admin uniquement)
router.get(
  "/dashboard",
  auth(["admin"]),
  consultationController.getConsultationDashboard
);

// ✅ Détails d’une consultation (admin, médecin, réceptionniste)
router.get(
  "/:id",
  auth(["admin", "medecin", "receptionniste"]),
  consultationController.getConsultationById
);

// ✏️ Mettre à jour une consultation (admin, médecin, réceptionniste)
// ⚠️ backend applique les restrictions selon rôle et statut
router.put(
  "/:id",
  auth(["admin", "medecin", "receptionniste"]),
  consultationController.updateConsultation
);

// 🔄 Changer le statut d’une consultation (admin ou médecin uniquement)
router.put(
  "/:id/statut",
  auth(["admin", "medecin"]),
  consultationController.changerStatutConsultation
);

module.exports = router;
