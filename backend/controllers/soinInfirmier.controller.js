// backend/controllers/soinInfirmier.controller.js
const { Op } = require("sequelize");
const {
  SoinInfirmier,
  Hospitalisation,
  Consultation,
  Utilisateur,
  Patient,
} = require("../models");

/**
 * ➕ Créer un soin infirmier
 * Rôle attendu : infirmier
 */
exports.createSoin = async (req, res) => {
  try {
    const {
      hospitalisation_id,
      consultation_id,
      type_soin,
      observations,
      date_soin,
    } = req.body;

    const infirmier_id = req.user.id;

    const soin = await SoinInfirmier.create({
      hospitalisation_id: hospitalisation_id || null,
      consultation_id: consultation_id || null,
      infirmier_id,
      type_soin,
      observations,
      date_soin,
    });

    res.status(201).json(soin);
  } catch (err) {
    console.error("Erreur création soin:", err);
    res.status(400).json({
      message: err.message || "Erreur création soin infirmier",
    });
  }
};

/**
 * 📄 Liste des soins (filtres + pagination)
 */
exports.getSoins = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      statut_validation,
      hospitalisation_id,
      consultation_id,
      infirmier_id,
    } = req.query;

    const where = {};

    if (statut_validation) where.statut_validation = statut_validation;
    if (hospitalisation_id) where.hospitalisation_id = hospitalisation_id;
    if (consultation_id) where.consultation_id = consultation_id;
    if (infirmier_id) where.infirmier_id = infirmier_id;

    const { count, rows } = await SoinInfirmier.findAndCountAll({
      where,
      order: [["date_soin", "DESC"]],
      limit: Number(limit),
      offset: (page - 1) * limit,
      include: [
        {
          model: Utilisateur,
          as: "infirmier",
          attributes: ["id", "noms"],
        },
        {
          model: Utilisateur,
          as: "medecin",
          attributes: ["id", "noms"],
        },
      ],
    });

    res.json({
      total: count,
      page: Number(page),
      pages: Math.ceil(count / limit),
      rows,
    });
  } catch (err) {
    console.error("Erreur chargement soins:", err);
    res.status(500).json({ message: "Erreur chargement soins" });
  }
};

/**
 * 🔍 Détail d’un soin
 */
exports.getSoinById = async (req, res) => {
  try {
    const soin = await SoinInfirmier.findByPk(req.params.id, {
      include: [
        { model: Utilisateur, as: "infirmier", attributes: ["id", "noms"] },
        { model: Utilisateur, as: "medecin", attributes: ["id", "noms"] },
        {
          model: Hospitalisation,
          as: "hospitalisation",
          include: [{ model: Patient, as: "patient" }],
        },
        {
          model: Consultation,
          as: "consultation",
          include: [{ model: Patient, as: "patient" }],
        },
      ],
    });

    if (!soin) {
      return res.status(404).json({ message: "Soin introuvable" });
    }

    res.json(soin);
  } catch (err) {
    console.error("Erreur récupération soin:", err);
    res.status(500).json({ message: "Erreur récupération soin" });
  }
};

/**
 * ✏️ Modifier un soin (tant qu’il n’est pas validé)
 */
exports.updateSoin = async (req, res) => {
  try {
    const soin = await SoinInfirmier.findByPk(req.params.id);

    if (!soin) {
      return res.status(404).json({ message: "Soin introuvable" });
    }

    if (soin.statut_validation !== "en_attente") {
      return res.status(403).json({
        message: "Impossible de modifier un soin déjà validé ou rejeté",
      });
    }

    await soin.update(req.body);
    res.json(soin);
  } catch (err) {
    console.error("Erreur mise à jour soin:", err);
    res.status(400).json({ message: "Erreur mise à jour soin" });
  }
};

/**
 * 🧑‍⚕️ Validation ou rejet par médecin
 */
exports.validerSoin = async (req, res) => {
  try {
    const { statut_validation, remarque_medecin } = req.body;

    if (!["valide", "rejete"].includes(statut_validation)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const soin = await SoinInfirmier.findByPk(req.params.id);

    if (!soin) {
      return res.status(404).json({ message: "Soin introuvable" });
    }

    await soin.update({
      statut_validation,
      remarque_medecin,
      medecin_id: req.user.id,
    });

    res.json(soin);
  } catch (err) {
    console.error("Erreur validation soin:", err);
    res.status(400).json({ message: "Erreur validation soin" });
  }
};

/**
 * 🗑️ Suppression (admin uniquement – logique)
 */
exports.deleteSoin = async (req, res) => {
  try {
    const soin = await SoinInfirmier.findByPk(req.params.id);

    if (!soin) {
      return res.status(404).json({ message: "Soin introuvable" });
    }

    await soin.destroy();
    res.json({ message: "Soin supprimé avec succès" });
  } catch (err) {
    console.error("Erreur suppression soin:", err);
    res.status(500).json({ message: "Erreur suppression soin" });
  }
};
