import { useEffect, useState } from "react";

export default function ApprovisionnementModal({ open, onClose, onSave, medicament }) {
  const [quantite, setQuantite] = useState("");
  const [fournisseur, setFournisseur] = useState("");
  const [dateAppro, setDateAppro] = useState("");

  useEffect(() => {
    if (open) {
      setQuantite("");
      setFournisseur("");
      setDateAppro(new Date().toISOString().split("T")[0]);
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!quantite || quantite <= 0) {
      alert("⚠️ La quantité doit être > 0");
      return;
    }
    onSave({
      quantite: Number(quantite),
      fournisseur: fournisseur.trim() || null,
      date_approvisionnement: dateAppro,
    });
  };

  if (!open || !medicament) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">📦 Approvisionner {medicament.nom}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Quantité</label>
            <input
              type="number"
              value={quantite}
              onChange={(e) => setQuantite(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Fournisseur</label>
            <input
              type="text"
              value={fournisseur}
              onChange={(e) => setFournisseur(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              placeholder="Ex: Pharma Express"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Date d'approvisionnement</label>
            <input
              type="date"
              value={dateAppro}
              onChange={(e) => setDateAppro(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white rounded bg-green-600 hover:bg-green-700"
            >
              Approvisionner
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
