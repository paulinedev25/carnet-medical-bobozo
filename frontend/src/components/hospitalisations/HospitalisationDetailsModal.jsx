// src/components/hospitalisations/HospitalisationDetailsModal.jsx
import React from "react";

export default function HospitalisationDetailsModal({ open, onClose, hospitalisation }) {
  if (!open || !hospitalisation) return null;

  const formatDate = (d) => {
    if (!d) return "-";
    try {
      return new Date(d).toLocaleString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (err) {
      console.error("Erreur formatage date:", err);
      return d;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-lg font-semibold mb-4">📋 Détails hospitalisation</h2>

        {/* Infos principales */}
        <div className="space-y-2">
          <p>
            <strong>👤 Patient :</strong>{" "}
            {hospitalisation.patient
              ? `${hospitalisation.patient.nom} ${hospitalisation.patient.postnom || ""} ${hospitalisation.patient.prenom || ""}`
              : "-"}
          </p>
          <p>
            <strong>🧑‍⚕️ Médecin :</strong> {hospitalisation.medecin?.noms || "-"}
          </p>
          <p>
            <strong>👩‍⚕️ Infirmier :</strong> {hospitalisation.infirmier?.noms || "-"}
          </p>
          <p>
            <strong>🏥 Service :</strong> {hospitalisation.service || "-"}
          </p>
          <p>
            <strong>🗓️ Date entrée :</strong> {formatDate(hospitalisation.date_entree)}
          </p>
          <p>
            <strong>📅 Date sortie :</strong> {formatDate(hospitalisation.date_sortie)}
          </p>
          <p>
            <strong>📋 Diagnostic admission :</strong> {hospitalisation.diagnostic_admission || "-"}
          </p>
          <p>
            <strong>💊 Traitement :</strong> {hospitalisation.traitement || "-"}
          </p>
          <p>
            <strong>📝 Observations :</strong> {hospitalisation.observations || "-"}
          </p>
          <p>
            <strong>⚡ Statut :</strong>{" "}
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${
                hospitalisation.statut === "admise"
                  ? "bg-blue-100 text-blue-700"
                  : hospitalisation.statut === "en_cours"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {hospitalisation.statut}
            </span>
          </p>
        </div>

        <hr className="my-4" />

        {/* Billet de sortie */}
        {hospitalisation.billet_sortie && (
          <div>
            <h3 className="text-md font-semibold mb-2">📑 Billet de sortie</h3>
            <p>
              <strong>Date :</strong> {formatDate(hospitalisation.billet_sortie.date_sortie)}
            </p>
            <p>
              <strong>Motif :</strong> {hospitalisation.billet_sortie.motif || "-"}
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded border">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
