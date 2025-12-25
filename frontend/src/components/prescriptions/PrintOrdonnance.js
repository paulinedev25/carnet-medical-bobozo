// src/components/prescriptions/PrintOrdonnance.js
import jsPDF from "jspdf";

/**
 * Simple helper pour générer une ordonnance PDF.
 * prescription: { id, consultation: { patient: {...} }, medicament: {...}, posologie, duree, observations, date_created }
 */
export function printOrdonnancePDF(prescription) {
  try {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Ordonnance médicale", 14, 20);
    doc.setFontSize(11);
    const patient = prescription.consultation?.patient;
    doc.text(`Prescription #${prescription.id}`, 14, 32);
    doc.text(`Patient : ${patient ? `${patient.nom || "-"} ${patient.prenom || ""}` : "-"}`, 14, 40);
    doc.text(`Médicament : ${prescription.medicament?.nom || "-"}`, 14, 48);
    doc.text(`Posologie : ${prescription.posologie || "-"}`, 14, 56);
    doc.text(`Durée : ${prescription.duree || "-"}`, 14, 64);
    doc.text(`Observations : ${prescription.observations || "-"}`, 14, 72);
    doc.text(`Date : ${prescription.createdAt ? new Date(prescription.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}`, 14, 82);

    doc.setFontSize(10);
    doc.text("Signature du médecin: ____________________", 14, 110);
    doc.save(`ordonnance-${prescription.id}.pdf`);
  } catch (err) {
    console.error("Erreur génération PDF ordonnance", err);
    throw err;
  }
}
