const express = require("express");
const router = express.Router();

const CarnetMedicalController = require("../controllers/carnetMedical.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get(
  "/:patientId",
  authMiddleware,
  CarnetMedicalController.getCarnetMedical
);

module.exports = router;
