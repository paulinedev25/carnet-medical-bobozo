const express = require("express");
const router = express.Router();
const controller = require("../controllers/hospitalisation.controller");
const auth = require("../middlewares/auth.middleware");

router.post("/", auth(["medecin", "infirmier", "admin"]), controller.createHospitalisation);
router.get("/", auth(["admin", "medecin", "infirmier"]), controller.getAllHospitalisations);
router.get("/:id", auth(["admin", "medecin", "infirmier"]), controller.getHospitalisationById);
router.put("/:id", auth(["medecin", "infirmier", "admin"]), controller.updateHospitalisation);
router.put("/:id/statut", auth(["medecin", "admin"]), controller.changerStatutHospitalisation);
router.delete("/:id", auth(["admin"]), controller.deleteHospitalisation);
router.get("/dashboard/stats", auth(["admin"]), controller.getHospitalisationDashboard);

module.exports = router;
