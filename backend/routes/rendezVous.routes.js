const express = require("express");
const router = express.Router();
const RendezVousController = require("../controllers/rendezVous.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// 🔒 Routes sécurisées
router.post("/", authMiddleware(), RendezVousController.create);
router.get("/patient/:patientId", authMiddleware(), RendezVousController.getByPatient);
router.put("/:id", authMiddleware(), RendezVousController.update);
router.delete("/:id", authMiddleware(), RendezVousController.delete);

module.exports = router;
