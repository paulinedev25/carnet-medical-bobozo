import React from "react";

export default function SoinsInfirmiersSection({ data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-6">
        Aucun soin infirmier enregistré.
      </div>
    );
  }

  // Tri par date décroissante
  const sorted = [...data].sort(
    (a, b) => new Date(b.date_soin) - new Date(a.date_soin)
  );

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
    } catch {
      return d;
    }
  };

  const labelStatut = (s) => {
    switch (s) {
      case "en_attente": return "En attente";
      case "valide": return "Validé";
      case "rejete": return "Rejeté";
      default: return s;
    }
  };

  const colorStatut = (s) => {
    switch (s) {
      case "en_attente": return "bg-yellow-100 text-yellow-700";
      case "valide": return "bg-green-100 text-green-700";
      case "rejete": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-4">
      {sorted.map((soin) => (
        <div
          key={soin.id}
          className="border rounded p-3 bg-gray-50 shadow-sm"
        >
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold">{soin.type_soin}</span>
            <span className={`px-2 py-1 rounded text-xs font-semibold ${colorStatut(soin.statut_validation)}`}>
              {labelStatut(soin.statut_validation)}
            </span>
          </div>

          <div className="text-sm text-gray-600 mb-1">
            <div>🗓️ Date : {formatDate(soin.date_soin)}</div>
            <div>👩‍⚕️ Infirmier : {soin.infirmier?.noms || "-"}</div>
            {soin.medecin && (
              <div>🧑‍⚕️ Médecin : {soin.medecin?.noms}</div>
            )}
          </div>

          <div className="text-sm text-gray-800">
            <div>💬 Observations : {soin.observations || "-"}</div>
            {soin.remarque_medecin && (
              <div>📝 Remarque médecin : {soin.remarque_medecin}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
