const CarnetMedicalService = require("../services/carnetMedical.service");

class CarnetMedicalController {
  /**
   * 📘 Récupérer le carnet médical complet d’un patient
   * GET /api/carnet-medical/:patientId
   */
  static async getCarnetMedical(req, res) {
    try {
      const { patientId } = req.params;

      // 🔒 Validation simple
      if (!patientId || isNaN(patientId)) {
        return res.status(400).json({
          message: "ID patient invalide",
        });
      }

      const carnet = await CarnetMedicalService.getCarnetMedical(
        Number(patientId)
      );

      return res.status(200).json(carnet);
    } catch (error) {
      console.error("❌ Erreur CarnetMedicalController:", error);

      // Cas métier connu
      if (error.message === "Patient introuvable") {
        return res.status(404).json({
          message: error.message,
        });
      }

      // Erreur inconnue
      return res.status(500).json({
        message: "Erreur lors de la récupération du carnet médical",
        error: error.message,
      });
    }
  }
}

module.exports = CarnetMedicalController;
