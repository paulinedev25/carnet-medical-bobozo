// src/components/consultations/ConsultationDetailsModal.jsx
import logoHopital from "../../images/logo-hopital.jpg";

export default function ConsultationDetailsModal({ open, onClose, consultation }) {
  if (!open || !consultation) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30"
        onClick={onClose} // Ferme si on clique sur le fond
      />

      {/* Contenu modal */}
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative z-10">
        {/* Logo hôpital */}
        <div className="flex justify-center mb-4">
          <img src={logoHopital} alt="Logo Hôpital" className="h-20 object-contain" />
        </div>

        <h2 className="text-lg font-semibold mb-4 text-center">
          📝 Détails de la Consultation
        </h2>

        <div id="consultation-details-print" className="space-y-4 text-sm text-gray-700">
          {/* Infos générales */}
          <div className="grid grid-cols-2 gap-4">
            <p>
              <strong>👤 Patient :</strong>{" "}
              {consultation.patient
                ? `${consultation.patient.nom} ${consultation.patient.postnom || ""} ${consultation.patient.prenom || ""}`
                : "-"}
            </p>
            <p><strong>👨‍⚕️ Médecin :</strong> {consultation.medecin?.noms || "-"}</p>
            <p>
              <strong>📅 Date :</strong>{" "}
              {consultation.date_consultation
                ? new Date(consultation.date_consultation).toLocaleString("fr-FR")
                : "-"}
            </p>
            <p><strong>📌 Statut :</strong> {consultation.statut}</p>
            <p><strong>📝 Motif :</strong> {consultation.motif || "-"}</p>
            <p><strong>🏥 Orientation :</strong> {consultation.orientation || "-"}</p>
            <p><strong>⚕️ État patient :</strong> {consultation.etat_patient || "-"}</p>
          </div>

          <hr />

          {/* Signes vitaux */}
          <div className="grid grid-cols-2 gap-4">
            <p><strong>🫀 Tension :</strong> {consultation.tension_arterielle || "-"}</p>
            <p><strong>🌡️ Température :</strong> {consultation.temperature ? `${consultation.temperature}°C` : "-"}</p>
            <p><strong>⚖️ Poids :</strong> {consultation.poids ? `${consultation.poids} kg` : "-"}</p>
            <p><strong>❤️ Pouls :</strong> {consultation.pouls || "-"}</p>
            <p><strong>💨 Fréquence respiratoire :</strong> {consultation.frequence_respiratoire || "-"}</p>
            <p><strong>🧪 Glycémie :</strong> {consultation.glycemie || "-"}</p>
          </div>

          <hr />

          {/* Observations */}
          <div className="space-y-2">
            <p><strong>🗒️ Observations initiales :</strong> {consultation.observations_initiales || "-"}</p>
            <p><strong>🧾 Diagnostic :</strong> {consultation.diagnostic || "-"}</p>
            <p><strong>💊 Traitement :</strong> {consultation.traitement || "-"}</p>
            <p><strong>🔬 Examens prescrits :</strong> {consultation.examens_prescrits || "-"}</p>
            <p><strong>📊 Résultats examens :</strong> {consultation.resultats_examens || "-"}</p>
            <p><strong>🩺 Observations médecin :</strong> {consultation.observations_medecin || "-"}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
