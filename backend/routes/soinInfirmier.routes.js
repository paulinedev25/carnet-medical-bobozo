const express = require("express");
const router = express.Router();
const SoinInfirmierController = require("../controllers/soinInfirmier.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/", authMiddleware(), SoinInfirmierController.create);
router.get("/patient/:patientId", authMiddleware(), SoinInfirmierController.getByPatient);
router.put("/:id", authMiddleware(), SoinInfirmierController.update);
router.delete("/:id", authMiddleware(), SoinInfirmierController.delete);

module.exports = router;
