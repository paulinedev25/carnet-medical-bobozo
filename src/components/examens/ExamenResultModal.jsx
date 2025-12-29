import { useState } from "react";

export default function ExamenResultModal({ open, onClose, onSave, examen }) {
  const [resultats, setResultats] = useState(examen?.resultats || "");
  const [interpretation, setInterpretation] = useState(examen?.interpretation || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!resultats.trim()) return alert("Veuillez entrer le résultat de l'examen");
    onSave({ resultats, interpretation });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-lg font-semibold">🔬 Résultat d'Examen</h2>

        <div>
          <label className="block text-sm mb-1">Résultat</label>
          <textarea
            value={resultats}
            onChange={(e) => setResultats(e.target.value)}
            className="border w-full px-3 py-2 rounded"
            rows={4}
            placeholder="Ex: Hémoglobine = 13.5 g/dl"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Interprétation</label>
          <textarea
            value={interpretation}
            onChange={(e) => setInterpretation(e.target.value)}
            className="border w-full px-3 py-2 rounded"
            rows={3}
            placeholder="Ex: Résultat dans les normes"
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
            className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            💾 Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}
