const { RendezVous } = require("../models");

class RendezVousService {
  static async createRendezVous(data) {
    return RendezVous.create(data);
  }

  static async getRendezVousByPatient(patientId) {
    return RendezVous.findAll({
      where: { patient_id: patientId },
      order: [["date_rendez_vous", "ASC"]],
    });
  }

  static async updateRendezVous(id, data) {
    const rdv = await RendezVous.findByPk(id);
    if (!rdv) throw new Error("Rendez-vous introuvable");
    return rdv.update(data);
  }

  static async deleteRendezVous(id) {
    const rdv = await RendezVous.findByPk(id);
    if (!rdv) throw new Error("Rendez-vous introuvable");
    return rdv.destroy();
  }
}

module.exports = RendezVousService;
