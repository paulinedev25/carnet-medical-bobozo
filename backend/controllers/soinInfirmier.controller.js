<<<<<<< HEAD
// backend/controllers/soinInfirmier.controller.js
const SoinInfirmierService = require("../services/soinInfirmier.service");

class SoinInfirmierController {
  static async create(req, res) {
    try {
      const soin = await SoinInfirmierService.createSoin(req.body);
      res.status(201).json(soin);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur création soin", error: err.message });
    }
  }

  static async getByPatient(req, res) {
    try {
      const { patientId } = req.params;
      const soins = await SoinInfirmierService.getSoinsByPatient(patientId);
      res.status(200).json(soins);
    } catch (err) {
      res.status(500).json({ message: "Erreur récupération soins", error: err.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const soin = await SoinInfirmierService.updateSoin(id, req.body);
      res.status(200).json(soin);
    } catch (err) {
      res.status(500).json({ message: "Erreur mise à jour soin", error: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await SoinInfirmierService.deleteSoin(id);
      res.status(200).json({ message: "Soin supprimé" });
    } catch (err) {
      res.status(500).json({ message: "Erreur suppression soin", error: err.message });
    }
  }
=======
const {
  SoinInfirmier,
  Hospitalisation,
  Consultation,
  Utilisateur,
  Patient,
} = require("../models");

class SoinInfirmierController {
  // ➕ Créer un soin infirmier
  static async create(req, res) {
    try {
      const data = req.body;
      const user = req.user;

      // validation : doit être lié à hospitalisation ou consultation
      if (!data.hospitalisation_id && !data.consultation_id) {
        return res.status(400).json({
          message:
            "Un soin doit être rattaché soit à une hospitalisation soit à une consultation",
        });
      }

      // infirmier_id obligatoire
      if (!data.infirmier_id) {
        return res.status(400).json({ message: "Identifiant infirmier requis" });
      }

      // vérification hospitalisation
      if (data.hospitalisation_id) {
        const hosp = await Hospitalisation.findByPk(data.hospitalisation_id);
        if (!hosp)
          return res.status(404).json({ message: "Hospitalisation introuvable" });
      }

      // vérification consultation
      if (data.consultation_id) {
        const consult = await Consultation.findByPk(data.consultation_id);
        if (!consult)
          return res.status(404).json({ message: "Consultation introuvable" });
      }

      // infirmier existe ?
      const infirmier = await Utilisateur.findByPk(data.infirmier_id);
      if (!infirmier)
        return res.status(404).json({ message: "Infirmier non trouvé" });

      // facultatif : médecin
      if (data.medecin_id) {
        const medecin = await Utilisateur.findByPk(data.medecin_id);
        if (!medecin)
          return res.status(404).json({ message: "Médecin non trouvé" });
      }

      // création
      const soin = await SoinInfirmier.create({
        hospitalisation_id: data.hospitalisation_id,
        consultation_id: data.consultation_id,
        infirmier_id: data.infirmier_id,
        medecin_id: data.medecin_id || null,
        type_soin: data.type_soin,
        type_traitement: data.type_traitement || null,
        dose: data.dose || null,
        frequence: data.frequence || null,
        parametres_vitaux: data.parametres_vitaux || null,
        evolution_etat: data.evolution_etat || null,
        activites: data.activites || null,
        observations: data.observations || null,
        statut_validation: data.statut_validation || "en_attente",
        remarque_medecin: data.remarque_medecin || null,
      });

      return res
        .status(201)
        .json({ message: "Soin infirmier créé ✅", soin });
    } catch (err) {
      console.error("❌ Erreur création soin :", err);
      return res.status(500).json({
        message: "Erreur serveur création soin",
        error: err.message,
      });
    }
  }

  // 📋 Liste des soins (optionnel : filtrage)
  static async getAll(req, res) {
    try {
      const soins = await SoinInfirmier.findAll({
        include: [
          { model: Hospitalisation, as: "hospitalisation" },
          { model: Consultation, as: "consultation" },
          { model: Utilisateur, as: "infirmier", attributes: ["id", "noms"] },
          { model: Utilisateur, as: "medecin", attributes: ["id", "noms"] },
        ],
        order: [["date_soin", "DESC"]],
      });
      return res.status(200).json(soins);
    } catch (err) {
      console.error("❌ Erreur liste soins :", err);
      return res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }

  // 📍 Soins par patient
  static async getByPatient(req, res) {
    try {
      const { patientId } = req.params;

      // vérification patient existant
      const patient = await Patient.findByPk(patientId);
      if (!patient)
        return res.status(404).json({ message: "Patient introuvable" });

      // si hospitalisation liée à ce patient
      const soins = await SoinInfirmier.findAll({
        where: {
          [SoinInfirmier.Sequelize.Op.or]: [
            { hospitalisation_id: patientId },
            { consultation_id: patientId },
          ],
        },
        include: [
          { model: Hospitalisation, as: "hospitalisation" },
          { model: Consultation, as: "consultation" },
          { model: Utilisateur, as: "infirmier", attributes: ["id", "noms"] },
          { model: Utilisateur, as: "medecin", attributes: ["id", "noms"] },
        ],
        order: [["date_soin", "DESC"]],
      });

      return res.status(200).json(soins);
    } catch (err) {
      console.error("❌ Erreur soins par patient :", err);
      return res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }

  // 📍 Détail d’un soin
  static async getById(req, res) {
    try {
      const soin = await SoinInfirmier.findByPk(req.params.id, {
        include: [
          { model: Hospitalisation, as: "hospitalisation" },
          { model: Consultation, as: "consultation" },
          { model: Utilisateur, as: "infirmier", attributes: ["id", "noms"] },
          { model: Utilisateur, as: "medecin", attributes: ["id", "noms"] },
        ],
      });
      if (!soin) return res.status(404).json({ message: "Soin introuvable" });
      return res.status(200).json(soin);
    } catch (err) {
      console.error("❌ Erreur détail soin :", err);
      return res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }

  // ✏️ Mise à jour d’un soin
  static async update(req, res) {
    try {
      const { id } = req.params;
      const soin = await SoinInfirmier.findByPk(id);
      if (!soin) return res.status(404).json({ message: "Soin introuvable" });

      const data = req.body;

      // mise à jour autorisée
      await soin.update(data);

      return res
        .status(200)
        .json({ message: "Soin mis à jour ✅", soin });
    } catch (err) {
      console.error("❌ Erreur mise à jour soin :", err);
      return res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }

  // 🗑️ Suppression d’un soin
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const soin = await SoinInfirmier.findByPk(id);
      if (!soin) return res.status(404).json({ message: "Soin introuvable" });
      await soin.destroy();
      return res.status(200).json({ message: "Soin supprimé ✅" });
    } catch (err) {
      console.error("❌ Erreur suppression soin :", err);
      return res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }
>>>>>>> ef61371244d90b551ab9b89b868eeaf3074f404c
}

module.exports = SoinInfirmierController;
