// backend/routes/soinInfirmier.routes.js
const express = require("express");
const router = express.Router();

const soinController = require("../controllers/soinInfirmier.controller");
const auth = require("../middleware/auth.middleware");

/**
 * 🔐 Toutes les routes nécessitent une authentification
 */
router.use(auth);

/**
 * ➕ Créer un soin (infirmier)
 * POST /api/soins
 */
router.post("/", soinController.createSoin);

/**
 * 📄 Liste des soins (filtres + pagination)
 * GET /api/soins
 */
router.get("/", soinController.getSoins);

/**
 * 🔍 Détail d’un soin
 * GET /api/soins/:id
 */
router.get("/:id", soinController.getSoinById);

/**
 * ✏️ Modifier un soin (si en attente)
 * PUT /api/soins/:id
 */
router.put("/:id", soinController.updateSoin);

/**
 * 🧑‍⚕️ Validation / rejet par médecin
 * PATCH /api/soins/:id/validation
 */
router.patch("/:id/validation", soinController.validerSoin);

/**
 * 🗑️ Suppression (admin)
 * DELETE /api/soins/:id
 */
router.delete("/:id", soinController.deleteSoin);

module.exports = router;
