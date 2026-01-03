const { Hospitalisation, Patient, Medecin, Infirmier } = require("../models");

/**
 * ➕ Créer une hospitalisation
 */
exports.createHospitalisation = async (req, res) => {
  try {
    const hospitalisation = await Hospitalisation.create(req.body);
    res.status(201).json(hospitalisation);
  } catch (error) {
    console.error("❌ createHospitalisation:", error);
    res.status(500).json({ message: "Erreur création hospitalisation" });
  }
};

/**
 * 📋 Liste des hospitalisations (pagination + filtre statut)
 */
exports.getAllHospitalisations = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const where = {};
    if (req.query.statut && req.query.statut !== "") {
      where.statut = req.query.statut;
    }

    const result = await Hospitalisation.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        { model: Patient, as: "patient", required: false },
        { model: Medecin, as: "medecin", required: false },
        { model: Infirmier, as: "infirmier", required: false },
      ],
    });

    res.json({
      rows: result.rows || [],
      count: result.count || 0,
      page,
      limit,
    });
  } catch (error) {
    console.error("❌ getAllHospitalisations:", error);
    res.status(500).json({ message: "Erreur chargement hospitalisations" });
  }
};

/**
 * 🔍 Récupérer une hospitalisation par ID
 */
exports.getHospitalisationById = async (req, res) => {
  try {
    const hospitalisation = await Hospitalisation.findByPk(req.params.id, {
      include: [
        { model: Patient, as: "patient", required: false },
        { model: Medecin, as: "medecin", required: false },
        { model: Infirmier, as: "infirmier", required: false },
      ],
    });

    if (!hospitalisation) {
      return res.status(404).json({ message: "Hospitalisation introuvable" });
    }

    res.json(hospitalisation);
  } catch (error) {
    console.error("❌ getHospitalisationById:", error);
    res.status(500).json({ message: "Erreur récupération hospitalisation" });
  }
};

/**
 * ✏️ Mise à jour hospitalisation
 */
exports.updateHospitalisation = async (req, res) => {
  try {
    const [updated] = await Hospitalisation.update(req.body, {
      where: { id: req.params.id },
    });

    if (!updated) {
      return res.status(404).json({ message: "Hospitalisation introuvable" });
    }

    const hospitalisation = await Hospitalisation.findByPk(req.params.id);
    res.json(hospitalisation);
  } catch (error) {
    console.error("❌ updateHospitalisation:", error);
    res.status(500).json({ message: "Erreur mise à jour hospitalisation" });
  }
};

/**
 * 🔄 Changer le statut d'une hospitalisation
 */
exports.changerStatutHospitalisation = async (req, res) => {
  try {
    const { statut } = req.body;

    if (!statut) {
      return res.status(400).json({ message: "Statut requis" });
    }

    const [updated] = await Hospitalisation.update(
      { statut },
      { where: { id: req.params.id } }
    );

    if (!updated) {
      return res.status(404).json({ message: "Hospitalisation introuvable" });
    }

    res.json({ message: "Statut mis à jour avec succès" });
  } catch (error) {
    console.error("❌ changerStatutHospitalisation:", error);
    res.status(500).json({ message: "Erreur changement statut" });
  }
};

/**
 * ❌ Supprimer une hospitalisation
 */
exports.deleteHospitalisation = async (req, res) => {
  try {
    const deleted = await Hospitalisation.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Hospitalisation introuvable" });
    }

    res.json({ message: "Hospitalisation supprimée" });
  } catch (error) {
    console.error("❌ deleteHospitalisation:", error);
    res.status(500).json({ message: "Erreur suppression hospitalisation" });
  }
};

/**
 * 📊 Dashboard hospitalisations
 */
exports.getHospitalisationDashboard = async (req, res) => {
  try {
    const total = await Hospitalisation.count();
    const admise = await Hospitalisation.count({ where: { statut: "admise" } });
    const enCours = await Hospitalisation.count({ where: { statut: "en_cours" } });
    const cloturee = await Hospitalisation.count({ where: { statut: "cloturee" } });

    res.json({
      total,
      admise,
      enCours,
      cloturee,
    });
  } catch (error) {
    console.error("❌ getHospitalisationDashboard:", error);
    res.status(500).json({ message: "Erreur dashboard hospitalisations" });
  }
};
