// src/components/patients/PatientDetailsModal.jsx
import React from "react";

export default function PatientDetailsModal({ open, onClose, patient }) {
  if (!open || !patient) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>

        {/* Titre */}
        <h2 className="text-xl font-semibold mb-4">
          Détails du patient
        </h2>

        {/* Infos patient */}
        <div className="space-y-2 text-sm">
          <p><strong>Nom complet :</strong> {[patient.nom, patient.postnom, patient.prenom].filter(Boolean).join(" ")}</p>
          <p><strong>Sexe :</strong> {patient.sexe}</p>
          <p><strong>Date de naissance :</strong> {(patient.date_naissance || "").slice(0, 10)}</p>
          <p><strong>Adresse :</strong> {patient.adresse || "-"}</p>
          <p><strong>N° dossier :</strong> {patient.numero_dossier || "-"}</p>
          <p><strong>Fonction :</strong> {patient.fonction || "-"}</p>
          <p><strong>Grade :</strong> {patient.grade || "-"}</p>
          <p><strong>Matricule :</strong> {patient.matricule || "-"}</p>
          <p><strong>Unité :</strong> {patient.unite || "-"}</p>
          <p><strong>Téléphone :</strong> {patient.telephone || "-"}</p>
          <p><strong>Date d’enregistrement :</strong> {(patient.date_enregistrement || "").slice(0, 10)}</p>
        </div>

        {/* Bouton fermer */}
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
