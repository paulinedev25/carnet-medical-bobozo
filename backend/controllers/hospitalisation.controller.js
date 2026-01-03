const db = require("../models");

const {
  Hospitalisation,
  Patient,
  Utilisateur,
  BilletSortie,
  Sequelize,
} = db;

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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const where = {};
    if (req.query.statut) {
      where.statut = req.query.statut;
    }

    const result = await Hospitalisation.findAndCountAll({
      where,
      limit,
      offset,
      order: [["id", "DESC"]], // champ existant
      include: [
        { model: Patient, as: "patient", required: false },
        { model: Utilisateur, as: "medecin", required: false },
        { model: Utilisateur, as: "infirmier", required: false },
        { model: BilletSortie, as: "billet_sortie", required: false },
      ],
    });

    res.json({
      rows: result.rows,
      count: result.count,
      page,
      limit,
    });
  } catch (error) {
    console.error("❌ getAllHospitalisations:", error);
    res.status(500).json({ message: "Erreur chargement hospitalisations" });
  }
};

/**
 * 🔍 Détail hospitalisation par ID
 */
exports.getHospitalisationById = async (req, res) => {
  try {
    const { id } = req.params;

    const hospitalisation = await Hospitalisation.findByPk(id, {
      include: [
        { model: Patient, as: "patient", required: false },
        { model: Utilisateur, as: "medecin", required: false },
        { model: Utilisateur, as: "infirmier", required: false },
        { model: BilletSortie, as: "billet_sortie", required: false },
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
    const { id } = req.params;

    const hospitalisation = await Hospitalisation.findByPk(id);
    if (!hospitalisation) {
      return res.status(404).json({ message: "Hospitalisation introuvable" });
    }

    await hospitalisation.update(req.body);
    res.json(hospitalisation);
  } catch (error) {
    console.error("❌ updateHospitalisation:", error);
    res.status(500).json({ message: "Erreur mise à jour hospitalisation" });
  }
};

/**
 * 🔄 Changer statut hospitalisation
 */
exports.changerStatutHospitalisation = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    const hospitalisation = await Hospitalisation.findByPk(id);
    if (!hospitalisation) {
      return res.status(404).json({ message: "Hospitalisation introuvable" });
    }

    hospitalisation.statut = statut;
    await hospitalisation.save();

    res.json(hospitalisation);
  } catch (error) {
    console.error("❌ changerStatutHospitalisation:", error);
    res.status(500).json({ message: "Erreur changement statut" });
  }
};

/**
 * ❌ Supprimer hospitalisation
 */
exports.deleteHospitalisation = async (req, res) => {
  try {
    const { id } = req.params;

    const hospitalisation = await Hospitalisation.findByPk(id);
    if (!hospitalisation) {
      return res.status(404).json({ message: "Hospitalisation introuvable" });
    }

    await hospitalisation.destroy();
    res.json({ message: "Hospitalisation supprimée avec succès" });
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

    const parStatut = await Hospitalisation.findAll({
      attributes: [
        "statut",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "total"],
      ],
      group: ["statut"],
    });

    res.json({
      total,
      parStatut,
    });
  } catch (error) {
    console.error("❌ getHospitalisationDashboard:", error);
    res.status(500).json({ message: "Erreur dashboard hospitalisations" });
  }
};
