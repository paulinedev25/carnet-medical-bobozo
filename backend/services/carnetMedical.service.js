"use strict";

const {
  Patient,
  Hospitalisation,
  Consultation,
  SoinInfirmier,
  Examen,
  Prescription,
  Medicament,
  Utilisateur,
} = require("../models");

class CarnetMedicalService {
  static async getCarnetMedical(patientId) {
    // 1️⃣ Patient
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      throw new Error("Patient introuvable");
    }

    // 2️⃣ Hospitalisations (UNIQUEMENT associations EXISTANTES)
    const hospitalisations = await Hospitalisation.findAll({
      where: { patient_id: patientId },
      order: [["date_entree", "DESC"]],
      include: [
        { model: Utilisateur, as: "medecin" },
        { model: Utilisateur, as: "infirmier" },
        { model: SoinInfirmier, as: "soins" },
        {
          model: Consultation,
          as: "consultations",
          include: [
            { model: Examen, as: "examens" },
            {
              model: Prescription,
              as: "prescriptions",
              include: [{ model: Medicament, as: "medicament" }],
            },
          ],
        },
      ],
    });

    // 3️⃣ Consultations ambulatoires
    const consultations = await Consultation.findAll({
      where: { patient_id: patientId },
      order: [["date_consultation", "DESC"]],
      include: [
        { model: Utilisateur, as: "medecin" },
        { model: Examen, as: "examens" },
        { model: SoinInfirmier, as: "soins" },
        {
          model: Prescription,
          as: "prescriptions",
          include: [{ model: Medicament, as: "medicament" }],
        },
      ],
    });

    return {
      patient,
      hospitalisations,
      consultations,
    };
  }
}

module.exports = CarnetMedicalService;
