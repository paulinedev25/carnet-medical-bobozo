// backend/services/rendezVous.service.js
const { RendezVous } = require("../models");

class RendezVousService {
  // Créer un rendez-vous
  static async createRendezVous(data) {
    return RendezVous.create(data);
  }

  // Lister tous les rendez-vous d’un patient
  static async getRendezVousByPatient(patientId) {
    return RendezVous.findAll({
      where: { patient_id: patientId },
      order: [["date_rendez_vous", "ASC"]],
    });
  }

  // Mettre à jour un rendez-vous
  static async updateRendezVous(id, data) {
    const rdv = await RendezVous.findByPk(id);
    if (!rdv) throw new Error("Rendez-vous introuvable");
    return rdv.update(data);
  }

  // Supprimer un rendez-vous
  static async deleteRendezVous(id) {
    const rdv = await RendezVous.findByPk(id);
    if (!rdv) throw new Error("Rendez-vous introuvable");
    return rdv.destroy();
  }
}

module.exports = RendezVousService;
