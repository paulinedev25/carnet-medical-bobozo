// backend/services/soinInfirmier.service.js
const { SoinInfirmier } = require("../models");

class SoinInfirmierService {
  static async createSoin(data) {
    return SoinInfirmier.create(data);
  }

  static async getSoinsByPatient(patientId) {
    return SoinInfirmier.findAll({
      where: { hospitalisation_id: patientId },
      order: [["date_soin", "ASC"]],
    });
  }

  static async updateSoin(id, data) {
    const soin = await SoinInfirmier.findByPk(id);
    if (!soin) throw new Error("Soin introuvable");
    return soin.update(data);
  }

  static async deleteSoin(id) {
    const soin = await SoinInfirmier.findByPk(id);
    if (!soin) throw new Error("Soin introuvable");
    return soin.destroy();
  }
}

module.exports = SoinInfirmierService;
