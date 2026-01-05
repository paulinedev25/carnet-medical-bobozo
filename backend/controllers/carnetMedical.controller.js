const Patient = require("../models/Patient");
const Consultation = require("../models/Consultation");
const Examen = require("../models/Examen");
const Hospitalisation = require("../models/Hospitalisation");
const SoinInfirmier = require("../models/SoinInfirmier");

exports.getCarnetMedical = async (req, res) => {
  console.log("📥 getCarnetMedical appelé");

  try {
    const { patientId } = req.params;
    console.log("➡️ patientId =", patientId);

    // 1️⃣ PATIENT (OBLIGATOIRE)
    const patient = await Patient.findByPk(patientId);
    console.log("✅ patient trouvé ?", !!patient);

    if (!patient) {
      return res.status(404).json({ message: "Patient introuvable" });
    }

    // 2️⃣ CONSULTATIONS
    const consultations = await Consultation.findAll({
      where: { patient_id: patientId },
    });
    console.log("✅ consultations:", consultations.length);

    // 3️⃣ EXAMENS
    const examens = await Examen.findAll({
      where: { patient_id: patientId },
    });
    console.log("✅ examens:", examens.length);

    // 4️⃣ HOSPITALISATIONS
    const hospitalisations = await Hospitalisation.findAll({
      where: { patient_id: patientId },
    });
    console.log("✅ hospitalisations:", hospitalisations.length);

    // 5️⃣ SOINS INFIRMIERS
    const soins_infirmiers = await SoinInfirmier.findAll({
      where: { patient_id: patientId },
    });
    console.log("✅ soins:", soins_infirmiers.length);

    // 🔚 RÉPONSE FINALE
    return res.json({
      patient,
      consultations,
      examens,
      hospitalisations,
      soins_infirmiers,
    });
  } catch (error) {
    console.error("❌ ERREUR carnet médical:", error);
    return res.status(500).json({
      message: "Erreur chargement carnet médical",
      error: error.message,
    });
  }
};
