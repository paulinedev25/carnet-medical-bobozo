import React, { useState } from "react";
import SoinsForm from "../forms/SoinsForm";
import api from "../../../services/api";

export default function SoinsInfirmiersSection({ data = [], patientId }) {
  const [soins, setSoins] = useState(data);
  const [editingSoin, setEditingSoin] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Rafraîchir la liste après création / update / suppression
  const refreshSoins = async () => {
    try {
      const res = await api.get(`/soins-infirmiers/patient/${patientId}`);
      setSoins(res.data);
    } catch (err) {
      console.error("Erreur chargement soins", err);
    }
  };

  const handleCreate = () => {
    setEditingSoin(null);
    setShowForm(true);
  };

  const handleEdit = (soin) => {
    setEditingSoin(soin);
    setShowForm(true);
  };

  const handleDelete = async (soin) => {
    if (!window.confirm("Supprimer ce soin ?")) return;
    try {
      await api.delete(`/soins-infirmiers/${soin.id}`);
      // Retirer de l’état
      setSoins((prev) => prev.filter((s) => s.id !== soin.id));
    } catch (err) {
      console.error("Erreur suppression soin :", err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Bouton Ajouter */}
      <div className="flex justify-end">
        <button
          onClick={handleCreate}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Ajouter un soin
        </button>
      </div>

      {/* Formulaire Modale */}
      {showForm && (
        <SoinsForm
          initialData={editingSoin}
          onSuccess={() => {
            setShowForm(false);
            refreshSoins();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Message si aucun soin */}
      {!Array.isArray(soins) || soins.length === 0 ? (
        <div className="text-center text-gray-500 py-6">
          Aucun soin infirmier enregistré.
        </div>
      ) : (
        soins
          // Tri par date décroissante
          .sort((a, b) => new Date(b.date_soin) - new Date(a.date_soin))
          .map((soin) => (
            <div
              key={soin.id}
              className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {soin.type_soin || "—"}
                </h3>

                {/* Boutons d’action */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(soin)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => handleDelete(soin)}
                    className="text-red-600 hover:text-red-800"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-700 mb-2">
                <div>
                  <strong>🗓️ Date :</strong>{" "}
                  {new Date(soin.date_soin).toLocaleString("fr-FR")}
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
          ))
      )}
    </div>
  );
}
