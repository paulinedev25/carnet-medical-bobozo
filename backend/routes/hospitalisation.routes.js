const express = require("express");
const router = express.Router();

// ✅ IMPORT OBLIGATOIRE (manquant chez toi)
const hospitalisationController = require("../controllers/hospitalisation.controller");

const auth = require("../middlewares/auth.middleware");

/**
 * ⚠️ ORDRE DES ROUTES CRITIQUE
 * Les routes fixes AVANT les routes dynamiques
 */

// 📊 Dashboard
router.get(
  "/dashboard/stats",
  auth(["admin"]),
  hospitalisationController.getHospitalisationDashboard
);

// 📋 Liste
router.get(
  "/",
  auth(["admin", "medecin", "infirmier"]),
  hospitalisationController.getAllHospitalisations
);

// ➕ Créer
router.post(
  "/",
  auth(["medecin", "infirmier", "admin"]),
  hospitalisationController.createHospitalisation
);

// 🔍 Détail
router.get(
  "/:id",
  auth(["admin", "medecin", "infirmier"]),
  hospitalisationController.getHospitalisationById
);

// ✏️ Mise à jour
router.put(
  "/:id",
  auth(["medecin", "infirmier", "admin"]),
  hospitalisationController.updateHospitalisation
);

// 🔄 Changer statut
router.put(
  "/:id/statut",
  auth(["medecin", "admin"]),
  hospitalisationController.changerStatutHospitalisation
);

// ❌ Supprimer
router.delete(
  "/:id",
  auth(["admin"]),
  hospitalisationController.deleteHospitalisation
);

module.exports = router;
