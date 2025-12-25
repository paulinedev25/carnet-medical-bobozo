import { useState } from "react";

export default function ExamenPrescriptionModal({ open, onClose, onSave }) {
  const [type_examen, setTypeExamen] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!type_examen.trim()) return alert("Veuillez préciser le type d'examen");
    onSave({ type_examen, notes });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-lg font-semibold">🧾 Prescrire un Examen</h2>

        <div>
          <label className="block text-sm mb-1">Type d'examen</label>
          <input
            type="text"
            value={type_examen}
            onChange={(e) => setTypeExamen(e.target.value)}
            className="border w-full px-3 py-2 rounded"
            placeholder="Ex: NFS, Glycémie, Radiographie"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Notes (optionnel)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="border w-full px-3 py-2 rounded"
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ✅ Prescrire
          </button>
        </div>
      </form>
    </div>
  );
}
