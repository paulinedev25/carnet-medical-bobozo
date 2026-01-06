import { useState } from "react";
import Modal from "../../ui/Modal";
import ExamenForm from "../examens/ExamenForm";
import api from "../../../services/api";
import { toast } from "react-toastify";

export default function ExamensSection({ examens = [], patientId }) {
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleAdd = () => {
    setEditing(null);
    setOpenModal(true);
  };

  const handleEdit = (ex) => {
    setEditing(ex);
    setOpenModal(true);
  };

  const handleDelete = async (ex) => {
    if (!window.confirm("⚠️ Supprimer cet examen ?")) return;
    try {
      await api.delete(`/examens/${ex.id}`);
      toast.success("🗑️ Examen supprimé");
      window.location.reload();
    } catch {
      toast.error("❌ Échec suppression");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">🧪 Examens</h2>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
        >
          + Ajouter
        </button>
      </div>

      {examens.length === 0 ? (
        <p className="text-gray-500 text-center py-6">Aucun examen.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Statut</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {examens.map((ex, idx) => (
                <tr key={ex?.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2">{ex?.type_examen || "-"}</td>
                  <td className="px-4 py-2">{ex?.statut || "-"}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(ex)}
                      className="px-2 py-1 border rounded hover:bg-gray-100"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(ex)}
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
        title={editing ? "Modifier Examen" : "Ajouter Examen"}
      >
        <ExamenForm
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
