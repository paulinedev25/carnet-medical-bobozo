const bcrypt = require('bcryptjs');
const Utilisateur = require("../models/utilisateur.model");
const multer = require("multer");
const path = require("path");

// =============================
// ⚙️ Configuration upload photo
// =============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `photo_${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });
exports.uploadPhoto = upload.single("photo");

// =============================
// 🔹 Helper pour gérer les erreurs
// =============================
function handleError(res, error, customMessage = "Erreur serveur") {
  console.error("❌ Erreur:", error);

  if (error.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({ message: "Cet email est déjà utilisé" });
  }

  if (error.name === "SequelizeValidationError") {
    return res
      .status(400)
      .json({ message: error.errors.map((e) => e.message).join(", ") });
  }

  res.status(500).json({ message: customMessage, error: error.message });
}

// =============================
// 🔹 Lister tous les utilisateurs
// =============================
exports.getAll = async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.findAll({
      attributes: [
        "id",
        "noms",
        "matricule",
        "grade",
        "fonction",
        "service",
        "email",
        "role",
        "photo",
        "observation",
        "statut",
        "date_creation",
      ],
    });
    res.json(utilisateurs);
  } catch (error) {
    handleError(res, error, "Impossible de charger les utilisateurs");
  }
};

// =============================
// 🔹 Créer un utilisateur
// =============================
exports.create = async (req, res) => {
  try {
    const { noms, email, mot_de_passe, role } = req.body;
    if (!noms || !email || !mot_de_passe || !role) {
      return res.status(400).json({ message: "Champs requis manquants" });
    }

    const hash = await bcrypt.hash(mot_de_passe, 10);

    const utilisateurData = {
      ...req.body,
      mot_de_passe: hash,
      statut: req.body.statut || "actif",
    };

    if (req.file) {
      utilisateurData.photo = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    const utilisateur = await Utilisateur.create(utilisateurData);
    res.status(201).json(utilisateur);
  } catch (error) {
    handleError(res, error, "Impossible de créer l'utilisateur");
  }
};

// =============================
// 🔹 Modifier un utilisateur
// =============================
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const utilisateur = await Utilisateur.findByPk(id);
    if (!utilisateur)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    const updatedData = { ...req.body };

    if (req.file) {
      updatedData.photo = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    if (updatedData.mot_de_passe) {
      updatedData.mot_de_passe = await bcrypt.hash(updatedData.mot_de_passe, 10);
    }

    await utilisateur.update(updatedData);
    res.json({ message: "✅ Utilisateur mis à jour", utilisateur });
  } catch (error) {
    handleError(res, error, "Impossible de mettre à jour l'utilisateur");
  }
};

// =============================
// 🔹 Supprimer un utilisateur
// =============================
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const utilisateur = await Utilisateur.findByPk(id);
    if (!utilisateur)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    await utilisateur.destroy();
    res.json({ message: "🗑️ Utilisateur supprimé" });
  } catch (error) {
    handleError(res, error, "Impossible de supprimer l'utilisateur");
  }
};

// =============================
// 🔹 Profil utilisateur connecté
// =============================
exports.getProfile = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByPk(req.user.id, {
      attributes: { exclude: ["mot_de_passe"] },
    });
    if (!utilisateur)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.json(utilisateur);
  } catch (error) {
    handleError(res, error, "Impossible de charger le profil");
  }
};

// =============================
// 🔹 Modifier son propre profil
// =============================
exports.updateProfile = async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByPk(req.user.id);
    if (!utilisateur)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    await utilisateur.update(req.body);
    res.json({ message: "Profil mis à jour", utilisateur });
  } catch (error) {
    handleError(res, error, "Impossible de mettre à jour le profil");
  }
};

// =============================
// 🔹 Modifier son mot de passe
// =============================
exports.changePassword = async (req, res) => {
  try {
    const { ancien_mdp, nouveau_mdp } = req.body;
    const utilisateur = await Utilisateur.findByPk(req.user.id);
    if (!utilisateur)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    const isMatch = await bcrypt.compare(ancien_mdp, utilisateur.mot_de_passe);
    if (!isMatch)
      return res.status(400).json({ message: "Ancien mot de passe incorrect" });

    const hash = await bcrypt.hash(nouveau_mdp, 10);
    await utilisateur.update({ mot_de_passe: hash });

    res.json({ message: "Mot de passe mis à jour" });
  } catch (error) {
    handleError(res, error, "Impossible de modifier le mot de passe");
  }
};

// =============================
// 🔹 Reset mot de passe (admin)
// =============================
exports.resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { mot_de_passe } = req.body;

    const utilisateur = await Utilisateur.findByPk(id);
    if (!utilisateur)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    const newPassword = mot_de_passe || "123456";
    const hash = await bcrypt.hash(newPassword, 10);

    await utilisateur.update({ mot_de_passe: hash });

    res.json({
      message: `🔑 Mot de passe réinitialisé pour ${utilisateur.email}`,
      newPassword,
    });
  } catch (error) {
    handleError(res, error, "Impossible de réinitialiser le mot de passe");
  }
};

// =============================
// 🔹 Récupérer uniquement les médecins
// =============================
exports.getMedecins = async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.findAll({
      attributes: [
        "id",
        "noms",
        "matricule",
        "grade",
        "fonction",
        "service",
        "email",
        "role",
        "photo",
        "observation",
        "statut",
        "date_creation",
      ],
      where: { statut: "actif" }, // 🔒 seulement actifs
    });

    // Filtrer médecins par rôle OU fonction
    const medecins = utilisateurs.filter((u) => {
      const role = (u.role || "").toLowerCase();
      const fonction = (u.fonction || "").toLowerCase();
      return role === "medecin" || fonction.includes("médecin");
    });

    res.json(medecins);
  } catch (error) {
    handleError(res, error, "Impossible de charger les médecins");
  }
};
