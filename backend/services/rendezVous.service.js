<<<<<<< HEAD
// backend/services/rendezVous.service.js
const { RendezVous } = require("../models");

class RendezVousService {
  // Créer un rendez-vous
=======
const { RendezVous } = require("../models");

class RendezVousService {
>>>>>>> ef61371244d90b551ab9b89b868eeaf3074f404c
  static async createRendezVous(data) {
    return RendezVous.create(data);
  }

<<<<<<< HEAD
  // Lister tous les rendez-vous d’un patient
=======
>>>>>>> ef61371244d90b551ab9b89b868eeaf3074f404c
  static async getRendezVousByPatient(patientId) {
    return RendezVous.findAll({
      where: { patient_id: patientId },
      order: [["date_rendez_vous", "ASC"]],
    });
  }

<<<<<<< HEAD
  // Mettre à jour un rendez-vous
=======
>>>>>>> ef61371244d90b551ab9b89b868eeaf3074f404c
  static async updateRendezVous(id, data) {
    const rdv = await RendezVous.findByPk(id);
    if (!rdv) throw new Error("Rendez-vous introuvable");
    return rdv.update(data);
  }

<<<<<<< HEAD
  // Supprimer un rendez-vous
=======
>>>>>>> ef61371244d90b551ab9b89b868eeaf3074f404c
  static async deleteRendezVous(id) {
    const rdv = await RendezVous.findByPk(id);
    if (!rdv) throw new Error("Rendez-vous introuvable");
    return rdv.destroy();
  }
}

module.exports = RendezVousService;
