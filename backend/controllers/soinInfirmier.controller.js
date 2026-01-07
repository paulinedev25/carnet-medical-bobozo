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
}

module.exports = SoinInfirmierController;
