const express = require("express");
const router = express.Router();

const utilisateurController = require("../controllers/utilisateur.controller");
const auth = require("../middlewares/auth.middleware");
const utilisateurDashboard = require("../controllers/utilisateurDashboard.controller");

// 🔒 Routes protégées par authentification + rôle
router.post(
  "/",
  auth(["admin"]),
  utilisateurController.uploadPhoto, // multer pour photo
  utilisateurController.create
);

router.get("/", auth(["admin","receptionniste"]), utilisateurController.getAll);
router.get("/me", auth(), utilisateurController.getProfile);
router.put("/me", auth(), utilisateurController.updateProfile);
router.put("/me/password", auth(), utilisateurController.changePassword);

// Dashboard
router.get("/dashboard", auth(["admin"]), utilisateurDashboard.getUtilisateurDashboard);
router.get("/dashboard/pdf", auth(["admin"]), utilisateurDashboard.getUtilisateurDashboardPDF);
router.get("/dashboard/excel", auth(["admin"]), utilisateurDashboard.getUtilisateurDashboardExcel);

// Admin : reset password
router.put("/:id/password", auth(["admin"]), utilisateurController.resetPassword);

// Modifier un utilisateur (admin)
router.put(
  "/:id",
  auth(["admin"]),
  utilisateurController.uploadPhoto, // multer pour photo
  utilisateurController.update
);

// Supprimer un utilisateur (admin)
router.delete("/:id", auth(["admin"]), utilisateurController.remove);

// Récupérer uniquement les médecins (accessible à tous les rôles connectés)
router.get("/medecins", auth(), utilisateurController.getMedecins);

module.exports = router;
