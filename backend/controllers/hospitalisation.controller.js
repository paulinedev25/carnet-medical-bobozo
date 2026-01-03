const { Hospitalisation, Patient, User } = require("../models");

module.exports = {

  // 📋 LISTE
  async getAllHospitalisations(req, res) {
    try {
      let { page = 1, limit = 10, statut } = req.query;

      page = parseInt(page, 10);
      limit = parseInt(limit, 10);

      if (Number.isNaN(page) || page < 1) page = 1;
      if (Number.isNaN(limit) || limit < 1) limit = 10;

      const where = {};
      if (statut) where.statut = statut;

      const result = await Hospitalisation.findAndCountAll({
        where,
        limit,
        offset: (page - 1) * limit,
        order: [["date_entree", "DESC"]],
        include: [
          { model: Patient, as: "patient" },
          { model: User, as: "medecin" },
          { model: User, as: "infirmier" },
        ],
      });

      return res.json({
        rows: result.rows,
        count: result.count,
        page,
        limit,
      });
    } catch (error) {
      console.error("❌ getAllHospitalisations:", error);
      return res.status(500).json({ message: "Erreur chargement hospitalisations" });
    }
  },

  // 📊 DASHBOARD
  async getHospitalisationDashboard(req, res) {
    try {
      const [total, admises, enCours, cloturees] = await Promise.all([
        Hospitalisation.count(),
        Hospitalisation.count({ where: { statut: "admise" } }),
        Hospitalisation.count({ where: { statut: "en_cours" } }),
        Hospitalisation.count({ where: { statut: "cloturee" } }),
      ]);

      return res.json({
        total,
        admises,
        enCours,
        cloturees,
      });
    } catch (error) {
      console.error("❌ getHospitalisationDashboard:", error);
      return res.status(500).json({ message: "Erreur dashboard hospitalisations" });
    }
  },

  // ➕ CREATE
  async createHospitalisation(req, res) {
    try {
      const hosp = await Hospitalisation.create(req.body);
      return res.status(201).json(hosp);
    } catch (error) {
      console.error("❌ createHospitalisation:", error);
      return res.status(500).json({ message: "Erreur création hospitalisation" });
    }
  },

  // 🔍 GET BY ID
  async getHospitalisationById(req, res) {
    try {
      const hosp = await Hospitalisation.findByPk(req.params.id, {
        include: [
          { model: Patient, as: "patient" },
          { model: User, as: "medecin" },
          { model: User, as: "infirmier" },
        ],
      });

      if (!hosp) {
        return res.status(404).json({ message: "Hospitalisation introuvable" });
      }

      return res.json(hosp);
    } catch (error) {
      console.error("❌ getHospitalisationById:", error);
      return res.status(500).json({ message: "Erreur récupération hospitalisation" });
    }
  },

  // ✏️ UPDATE
  async updateHospitalisation(req, res) {
    try {
      const hosp = await Hospitalisation.findByPk(req.params.id);
      if (!hosp) return res.status(404).json({ message: "Introuvable" });

      await hosp.update(req.body);
      return res.json(hosp);
    } catch (error) {
      console.error("❌ updateHospitalisation:", error);
      return res.status(500).json({ message: "Erreur mise à jour" });
    }
  },

  // 🔄 STATUT
  async changerStatutHospitalisation(req, res) {
    try {
      const hosp = await Hospitalisation.findByPk(req.params.id);
      if (!hosp) return res.status(404).json({ message: "Introuvable" });

      hosp.statut = req.body.statut;
      await hosp.save();

      return res.json(hosp);
    } catch (error) {
      console.error("❌ changerStatutHospitalisation:", error);
      return res.status(500).json({ message: "Erreur changement statut" });
    }
  },

  // ❌ DELETE
  async deleteHospitalisation(req, res) {
    try {
      const hosp = await Hospitalisation.findByPk(req.params.id);
      if (!hosp) return res.status(404).json({ message: "Introuvable" });

      await hosp.destroy();
      return res.json({ message: "Supprimée" });
    } catch (error) {
      console.error("❌ deleteHospitalisation:", error);
      return res.status(500).json({ message: "Erreur suppression" });
    }
  },
};
