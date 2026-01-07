const express = require("express");
const router = express.Router();
const SoinInfirmierController = require("../controllers/soinInfirmier.controller");
<<<<<<< HEAD
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/", authMiddleware(), SoinInfirmierController.create);
router.get("/patient/:patientId", authMiddleware(), SoinInfirmierController.getByPatient);
router.put("/:id", authMiddleware(), SoinInfirmierController.update);
router.delete("/:id", authMiddleware(), SoinInfirmierController.delete);
=======
const auth = require("../middlewares/auth.middleware");

// 📍 Création d’un soin infirmier (infirmier, médecin, admin)
router.post(
  "/",
  auth(["admin", "medecin", "infirmier"]),
  SoinInfirmierController.create
);

// 📋 Liste des soins (tous ou filtrés par patient)
router.get(
  "/",
  auth(["admin", "medecin", "infirmier"]),
  SoinInfirmierController.getAll
);

// 📍 Récupérer tous les soins d’un patient
router.get(
  "/patient/:patientId",
  auth(["admin", "medecin", "infirmier", "receptionniste"]),
  SoinInfirmierController.getByPatient
);

// ✅ Détails d’un soin
router.get(
  "/:id",
  auth(["admin", "medecin", "infirmier"]),
  SoinInfirmierController.getById
);

// ✏️ Mise à jour (infirmier qui a fait le soin, médecin ou admin)
router.put(
  "/:id",
  auth(["admin", "medecin", "infirmier"]),
  SoinInfirmierController.update
);

// 🗑️ Suppression
router.delete(
  "/:id",
  auth(["admin", "medecin", "infirmier"]),
  SoinInfirmierController.delete
);
>>>>>>> ef61371244d90b551ab9b89b868eeaf3074f404c

module.exports = router;
