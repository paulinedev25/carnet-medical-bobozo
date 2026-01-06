import React from "react";

export default function SoinsInfirmiersSection({ data = [] }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-6">
        Aucun soin infirmier enregistré.
      </div>
    );
  }

  // Tri par date décroissante (les plus récents en premier)
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
      case "en_attente":
        return "En attente";
      case "valide":
        return "Validé";
      case "rejete":
        return "Rejeté";
      default:
        return s;
    }
  };

  const colorStatut = (s) => {
    switch (s) {
      case "en_attente":
        return "bg-yellow-100 text-yellow-700";
      case "valide":
        return "bg-green-100 text-green-700";
      case "rejete":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-4">
      {sorted.map((soin) => (
        <div
          key={soin.id}
          className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-800">
              {soin.type_soin || "—"}
            </h3>
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${colorStatut(
                soin.statut_validation
              )}`}
            >
              {labelStatut(soin.statut_validation)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 mb-2">
            <div>
              <strong>🗓️ Date :</strong> {formatDate(soin.date_soin)}
            </div>
            <div>
              <strong>👩‍⚕️ Infirmier :</strong>{" "}
              {soin.infirmier?.noms || "-"}
            </div>
            {soin.medecin && (
              <div>
                <strong>🧑‍⚕️ Médecin :</strong>{" "}
                {soin.medecin?.noms || "-"}
              </div>
            )}
          </div>

          <div className="text-sm text-gray-800 space-y-1">
            <div>
              <strong>💬 Observations :</strong>{" "}
              {soin.observations || "-"}
            </div>
            {soin.remarque_medecin && (
              <div>
                <strong>📝 Remarque médecin :</strong>{" "}
                {soin.remarque_medecin}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
