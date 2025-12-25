// src/components/prescriptions/DeliverModal.jsx
import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";

export default function DeliverModal({ open, onClose, onDeliver, prescription, medicaments = [] }) {
  const [form, setForm] = useState({ quantite: "", unite: "", observations: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // ⚡️ Calcul stock réel
  const stock = useMemo(() => {
    if (!prescription) return 0;
    const medId = prescription.medicament_id ?? prescription.medicament?.id;
    const med = medicaments.find((m) => m.id === medId);
    return med?.quantite_disponible ?? prescription.medicament?.quantite_disponible ?? 0;
  }, [prescription, medicaments]);

  useEffect(() => {
    if (prescription) {
      setForm({
        quantite: prescription.quantite_prescrite ?? prescription.quantite ?? prescription.quantite_delivree ?? "",
        unite: prescription.medicament?.unite_nom_commercial ?? prescription.medicament_unite ?? "",
        observations: prescription.observations ?? "",
      });
      setErrors({});
      setSubmitting(false);
    } else {
      setForm({ quantite: "", unite: "", observations: "" });
      setErrors({});
      setSubmitting(false);
    }
  }, [prescription, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const errs = {};
    const qty = Number(form.quantite);

    if (!qty || qty <= 0) errs.quantite = "Quantité valide requise";
    if (!form.unite?.trim()) errs.unite = "Unité requise";
    if (qty > stock) errs.quantite = `⚠️ Quantité disponible insuffisante (${stock} ${form.unite})`;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!validate()) return;

    setSubmitting(true);
    try {
      // 🔹 envoyer le champ attendu par le backend
      await onDeliver({
        quantite_delivree: Number(form.quantite),
        unite: form.unite.trim(),
        observations: form.observations.trim() || undefined,
      });
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Erreur lors de la livraison");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">💊 Livraison Prescription</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Médicament */}
          <div>
            <label className="block text-sm font-medium">Médicament</label>
            <div className="text-gray-700">
              {prescription?.medicament?.nom_commercial || prescription?.medicament_nom || "—"} 
              ({form.unite})
            </div>
            <div className="text-gray-500 text-sm">
              Quantité disponible: {stock} {form.unite}
            </div>
          </div>

          {/* Quantité + unité */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium">Quantité à délivrer *</label>
              <input
                type="number"
                name="quantite"
                value={form.quantite}
                onChange={handleChange}
                className="border rounded w-full px-3 py-2"
                min="1"
                max={stock}
                step="1"
              />
              <p className="text-gray-500 text-sm">
                Maximum disponible : {stock} {form.unite}
              </p>
              {errors.quantite && <p className="text-red-500 text-sm">{errors.quantite}</p>}
            </div>
            <div style={{ width: 120 }}>
              <label className="block text-sm font-medium">Unité *</label>
              <input
                type="text"
                name="unite"
                value={form.unite}
                onChange={handleChange}
                className="border rounded w-full px-2 py-2"
                placeholder="mg / ml / unité"
              />
              {errors.unite && <p className="text-red-500 text-sm">{errors.unite}</p>}
            </div>
          </div>

          {/* Observations */}
          <div>
            <label className="block text-sm font-medium">Observations</label>
            <textarea
              name="observations"
              value={form.observations}
              onChange={handleChange}
              className="border rounded w-full px-3 py-2"
              rows="3"
              placeholder="Notes supplémentaires (facultatif)"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              disabled={submitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? "Livraison..." : "Délivrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
