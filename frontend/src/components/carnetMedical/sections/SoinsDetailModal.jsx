import React from "react";

export default function SoinsDetailModal({
  soin,
  onClose,
  onEdit,
  onDelete,
}) {
  if (!soin) return null;

  const formatDate = (d) =>
    new Date(d).toLocaleString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full p-6 space-y-4 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800">
          {soin.type_soin || "Détail du soin"}
        </h2>

        {/* Détails */}
        <div className="grid gap-2 text-gray-700 text-sm">
          <div>
            <strong>Date : </strong> {formatDate(soin.date_soin)}
          </div>
          <div>
            <strong>Infirmier : </strong> {soin.infirmier?.noms || "-"}
          </div>
          <div>
            <strong>Médecin : </strong> {soin.medecin?.noms || "-"}
          </div>
          <div>
            <strong>Statut : </strong> {soin.statut_validation}
          </div>
          <div>
            <strong>Observations : </strong> {soin.observations || "-"}
          </div>
          <div>
            <strong>Remarque médecin : </strong> {soin.remarque_medecin || "-"}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => onEdit(soin)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ✏️ Modifier
          </button>

          <button
            onClick={() => onDelete(soin)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            🗑️ Supprimer
          </button>

          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            ❌ Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
