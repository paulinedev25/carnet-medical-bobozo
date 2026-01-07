import { useState } from "react";
import Modal from "../../ui/Modal"; // ou adaptes selon ton arborescence
import HospitalisationForm from "../CarnetMedical/HospitalisationForm";
import api from "../../../services/api";
import { toast } from "react-toastify";

export default function HospitalisationsSection({
  hospitalisations = [],
  patientId,
}) {
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleAdd = () => {
    setEditing(null);
    setOpenModal(true);
  };

  const handleEdit = (hosp) => {
    setEditing(hosp);
    setOpenModal(true);
  };

  const handleDelete = async (hosp) => {
    if (!window.confirm("⚠️ Supprimer cette hospitalisation ?")) return;
    try {
      await api.delete(`/hospitalisations/${hosp.id}`);
      toast.success("🗑️ Hospitalisation supprimée");
      window.location.reload(); // reload après suppression
    } catch (error) {
      toast.error("❌ Échec suppression");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header + bouton ajouter */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">🏥 Hospitalisations</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
        >
          + Ajouter
        </button>
      </div>

      {/* Liste hospitalisations */}
      {hospitalisations.length === 0 ? (
        <p className="text-gray-500 text-center py-6">
          Aucune hospitalisation enregistrée.
        </p>
      ) : (
        <div className="grid gap-4">
          {hospitalisations.map((h) => (
            <div
              key={h?.id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <p>
                <b>Service :</b> {h?.service || "-"}
              </p>
              <p>
                <b>Date entrée :</b>{" "}
                {h?.date_entree
                  ? new Date(h.date_entree).toLocaleDateString("fr-FR")
                  : "-"}
              </p>
              <p>
                <b>Statut :</b> {h?.statut || "-"}
              </p>

              {/* Actions */}
              <div className="mt-2 flex gap-2 text-sm">
                <button
                  onClick={() => handleEdit(h)}
                  className="px-2 py-1 border rounded hover:bg-gray-100"
                >
                  ✏️ Modifier
                </button>
                <button
                  onClick={() => handleDelete(h)}
                  className="px-2 py-1 border text-red-600 rounded hover:bg-gray-100"
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal pour ajout / édition */}
      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title={
          editing
            ? "Modifier l'hospitalisation"
            : "Ajouter une hospitalisation"
        }
      >
        <HospitalisationForm
          patientId={patientId}
          initialData={editing}
          onSave={() => {
            setOpenModal(false);
            window.location.reload();
          }}
        />
      </Modal>
    </div>
  );
}
