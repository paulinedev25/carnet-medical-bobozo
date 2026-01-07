import { useState } from "react";
import Modal from "../../ui/Modal";
import ConsultationForm from "../consultations/ConsultationForm";
import api from "../../../services/api";
import { toast } from "react-toastify";

export default function ConsultationsSection({ consultations = [], patientId }) {
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleAdd = () => {
    setEditing(null);
    setOpenModal(true);
  };

  const handleEdit = (c) => {
    setEditing(c);
    setOpenModal(true);
  };

  const handleDelete = async (c) => {
    if (!window.confirm("⚠️ Supprimer cette consultation ?")) return;
    try {
      await api.delete(`/consultations/${c.id}`);
      toast.success("🗑️ Consultation supprimée");
      window.location.reload();
    } catch {
      toast.error("❌ Échec suppression");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">📋 Consultations</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
        >
          + Ajouter
        </button>
      </div>

      {consultations.length === 0 ? (
        <p className="text-gray-500 text-center py-6">Aucune consultation.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm bg-white rounded shadow">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Motif</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Médecin</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {consultations.map((c, idx) => (
                <tr key={c?.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{c?.motif || "-"}</td>
                  <td className="px-4 py-2">
                    {c?.date_consultation
                      ? new Date(c.date_consultation).toLocaleDateString("fr-FR")
                      : "-"}
                  </td>
                  <td className="px-4 py-2">{c?.medecin?.noms || "-"}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(c)}
                      className="px-2 py-1 border rounded hover:bg-gray-100"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(c)}
                      className="px-2 py-1 border text-red-600 rounded hover:bg-gray-100"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title={editing ? "Modifier Consultation" : "Nouvelle Consultation"}
      >
        <ConsultationForm
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
