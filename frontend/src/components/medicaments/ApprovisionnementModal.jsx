import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ApprovisionnementModal({ open, onClose, onSave, medicament }) {
  const initialState = {
    quantite: "",
    fournisseur: "",
    date_approvisionnement: new Date().toISOString().split("T")[0],
  };

  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (open) {
      setForm(initialState);
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.quantite || Number(form.quantite) <= 0) {
      toast.error("⚠️ La quantité doit être supérieure à 0");
      return;
    }

    if (form.date_approvisionnement && isNaN(new Date(form.date_approvisionnement).getTime())) {
      toast.error("⚠️ La date d'approvisionnement est invalide");
      return;
    }

    onSave({
      quantite: Number(form.quantite),
      fournisseur: form.fournisseur.trim() || null,
      date_approvisionnement: form.date_approvisionnement,
    });
  };

  if (!open || !medicament) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          📦 Approvisionner {medicament.nom_commercial || medicament.nom}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Quantité *</label>
            <input
              type="number"
              name="quantite"
              value={form.quantite}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Fournisseur</label>
            <input
              type="text"
              name="fournisseur"
              value={form.fournisseur}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              placeholder="Ex: Pharma Express"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Date d'approvisionnement</label>
            <input
              type="date"
              name="date_approvisionnement"
              value={form.date_approvisionnement}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              required
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
