const express = require("express");
const router = express.Router();

const CarnetMedicalController = require("../controllers/carnetMedical.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get(
  "/:patientId",
  authMiddleware,
  CarnetMedicalController.getCarnetMedical
);

module.exports = router;
