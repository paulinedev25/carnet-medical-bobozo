<<<<<<< HEAD
// backend/controllers/rendezVous.controller.js
=======
>>>>>>> ef61371244d90b551ab9b89b868eeaf3074f404c
const RendezVousService = require("../services/rendezVous.service");

class RendezVousController {
  static async create(req, res) {
    try {
      const rdv = await RendezVousService.createRendezVous(req.body);
      res.status(201).json(rdv);
    } catch (err) {
<<<<<<< HEAD
      console.error(err);
=======
>>>>>>> ef61371244d90b551ab9b89b868eeaf3074f404c
      res.status(500).json({ message: "Erreur création rendez-vous", error: err.message });
    }
  }

  static async getByPatient(req, res) {
    try {
      const { patientId } = req.params;
      const rdvs = await RendezVousService.getRendezVousByPatient(patientId);
      res.status(200).json(rdvs);
    } catch (err) {
      res.status(500).json({ message: "Erreur récupération rendez-vous", error: err.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const rdv = await RendezVousService.updateRendezVous(id, req.body);
      res.status(200).json(rdv);
    } catch (err) {
      res.status(500).json({ message: "Erreur mise à jour rendez-vous", error: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await RendezVousService.deleteRendezVous(id);
      res.status(200).json({ message: "Rendez-vous supprimé" });
    } catch (err) {
      res.status(500).json({ message: "Erreur suppression rendez-vous", error: err.message });
    }
  }
}

module.exports = RendezVousController;
