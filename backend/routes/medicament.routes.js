const express = require("express");
const router = express.Router();

const medicamentController = require("../controllers/medicament.controller");
const auth = require("../middlewares/auth.middleware");

/**
 * 💊 Routes de gestion des médicaments
 * Base path : /api/medicaments
 */

// 📋 Liste complète – tous les utilisateurs authentifiés
router.get(
  "/",
  auth(),
  medicamentController.getAllMedicaments
);

// 🚨 Médicaments en rupture ou sous seuil
// ⚠️ IMPORTANT : doit être AVANT "/:id"
router.get(
  "/alertes",
  auth(["pharmacien", "admin", "chef_service"]),
  medicamentController.alertesStock
);

// 🔍 Obtenir un médicament par ID
router.get(
  "/:id",
  auth(),
  medicamentController.getMedicamentById
);

// ➕ Ajouter un médicament
router.post(
  "/",
  auth(["pharmacien", "admin"]),
  medicamentController.createMedicament
);

// ✏️ Mettre à jour un médicament
router.put(
  "/:id",
  auth(["pharmacien", "admin"]),
  medicamentController.updateMedicament
);

// ❌ Supprimer un médicament
router.delete(
  "/:id",
  auth(["pharmacien", "admin"]),
  medicamentController.deleteMedicament
);

// ♻️ Réapprovisionner un médicament
router.post(
  "/:id/reapprovisionner",
  auth(["pharmacien", "admin"]),
  medicamentController.reapprovisionnerMedicament
);

module.exports = router;
