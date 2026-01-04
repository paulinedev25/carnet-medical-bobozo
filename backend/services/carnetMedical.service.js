const {
  Patient,
  Hospitalisation,
  Consultation,
  SoinInfirmier,
  Examen,
  Prescription,
  Medicament,
  RendezVous,
  Utilisateur,
} = require("../models");

class CarnetMedicalService {
  static async getCarnetMedical(patientId) {
    // 1️⃣ Patient
    const patient = await Patient.findByPk(patientId);
    if (!patient) throw new Error("Patient introuvable");

    // 2️⃣ Hospitalisations
    const hospitalisations = await Hospitalisation.findAll({
      where: { patient_id: patientId },
      order: [["date_entree", "DESC"]],
      include: [
        { model: Utilisateur, as: "medecin" },
        { model: Utilisateur, as: "infirmier" },
        { model: SoinInfirmier, as: "soins" },
        { model: Examen, as: "examens" },
        {
          model: Prescription,
          as: "prescriptions",
          include: [{ model: Medicament, as: "medicaments" }],
        },
      ],
    });

    // 3️⃣ Consultations
    const consultations = await Consultation.findAll({
      where: { patient_id: patientId },
      order: [["date_consultation", "DESC"]],
      include: [
        { model: Utilisateur, as: "medecin" },
        { model: Examen, as: "examens" },
        { model: SoinInfirmier, as: "soins" },
        { model: RendezVous, as: "rendezVous" },
        {
          model: Prescription,
          as: "prescriptions",
          include: [{ model: Medicament, as: "medicaments" }],
        },
      ],
    });

    // 4️⃣ Rendez-vous ambulatoires
    const rendezVous = await RendezVous.findAll({
      where: { patient_id: patientId },
      order: [["date_rendez_vous", "DESC"]],
    });

    return {
      patient,
      hospitalisations,
      consultations,
      rendezVous,
    };
  }
}

module.exports = CarnetMedicalService;
