// src/components/prescriptions/PrescriptionModal.jsx
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

export default function PrescriptionModal({
  open,
  onClose,
  onSave,
  prescription = null,
  medicaments = [],
  consultations = [],
}) {
  const [form, setForm] = useState({
    consultation_id: "",
    medicament_id: "",
    medicament_nom: "",
    posologie: "",
    duree: "",
    quantite: "",
    unite: "",
    observations: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Normalisation des listes
  const consultList = useMemo(() => {
    if (Array.isArray(consultations)) return consultations;
    if (consultations?.rows && Array.isArray(consultations.rows)) return consultations.rows;
    return [];
  }, [consultations]);

  const medicamentsList = useMemo(() => {
    if (Array.isArray(medicaments)) return medicaments;
    if (medicaments?.rows && Array.isArray(medicaments.rows)) return medicaments.rows;
    return [];
  }, [medicaments]);

  // Options pour select
  const consultOptions = useMemo(() => {
    const base = [...consultList];
    if (prescription?.consultation && !base.some((c) => c.id === prescription.consultation.id)) {
      base.unshift(prescription.consultation);
    }
    return base;
  }, [consultList, prescription]);

  const medicamentOptions = useMemo(() => {
    const base = [...medicamentsList];
    if (prescription?.medicament && !base.some((m) => m.id === prescription.medicament.id)) {
      base.unshift(prescription.medicament);
    }
    return base;
  }, [medicamentsList, prescription]);

  // Pré-remplissage / reset
  useEffect(() => {
    if (prescription) {
      setForm({
        consultation_id: prescription.consultation_id ? String(prescription.consultation_id) : "",
        medicament_id: prescription.medicament_id ? String(prescription.medicament_id) : "",
        medicament_nom: prescription.medicament_nom ?? (prescription.medicament?.nom_commercial || ""),
        posologie: prescription.posologie ?? "",
        duree: prescription.duree ?? "",
        quantite: prescription.quantite_prescrite ?? prescription.quantite ?? prescription.quantite_delivree ?? "",
        unite: prescription.unite ?? prescription.medicament?.unite ?? "",
        observations: prescription.observations ?? "",
      });
    } else {
      setForm({
        consultation_id: "",
        medicament_id: "",
        medicament_nom: "",
        posologie: "",
        duree: "",
        quantite: "",
        unite: "",
        observations: "",
      });
    }
    setErrors({});
    setSubmitting(false);
  }, [prescription, open]);

  if (!open) return null;

  // Gestion des changements
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "medicament_id" && value
        ? {
            medicament_nom: medicamentOptions.find((m) => String(m.id) === value)?.nom_commercial || "",
            unite: medicamentOptions.find((m) => String(m.id) === value)?.unite || "",
          }
        : {}),
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Validation
  const validate = () => {
    const errs = {};
    if (!form.consultation_id) errs.consultation_id = "Consultation requise";
    if (!form.medicament_id && !form.medicament_nom.trim()) errs.medicament_nom = "Médicament requis";
    if (!form.posologie.trim()) errs.posologie = "Posologie requise";
    if (!form.duree.trim()) errs.duree = "Durée requise";
    if (!form.quantite || Number(form.quantite) <= 0) errs.quantite = "Quantité valide requise";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Soumission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!validate()) return;

    const payload = {
      consultation_id: Number(form.consultation_id),
      ...(form.medicament_id ? { medicament_id: Number(form.medicament_id) } : {}),
      ...(form.medicament_nom ? { medicament_nom: form.medicament_nom.trim() } : {}),
      posologie: form.posologie.trim(),
      duree: form.duree.trim(),
      quantite: parseInt(form.quantite, 10),
      unite: form.unite?.trim() || undefined,
      observations: form.observations?.trim() || undefined,
    };

    setSubmitting(true);
    try {
      await onSave(payload);
      onClose();
    } catch (err) {
      const serverMsg = err?.response?.data?.message || err?.message;
      toast.error(serverMsg || "Erreur lors de l'enregistrement");
    } finally {
      setSubmitting(false);
    }
  };

  // Labels
  const getConsultationLabel = (c) => {
    if (!c) return "—";
    const patient = c.patient || {};
    const patientName = `${patient.nom || ""} ${patient.prenom || ""}`.trim();
    const date = c.date_consultation ? new Date(c.date_consultation).toLocaleDateString() : `ID:${c.id}`;
    return `${patientName || "Patient inconnu"} — ${date}`;
  };

  const getMedLabel = (m) => {
    if (!m) return "—";
    return `${m.nom_commercial || m.nom || "Médicament"}${m.unite ? ` (${m.unite})` : ""}`;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-4">
          {prescription ? "✏️ Modifier la prescription" : "➕ Nouvelle prescription"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Consultation */}
          <div>
            <label className="block text-sm font-medium">Consultation *</label>
            <select
              name="consultation_id"
              value={form.consultation_id}
              onChange={handleChange}
              className="border rounded w-full px-3 py-2"
            >
              <option value="">-- Sélectionner une consultation --</option>
              {consultOptions.map((c) => (
                <option key={c.id} value={String(c.id)}>
                  {getConsultationLabel(c)}
                </option>
              ))}
            </select>
            {errors.consultation_id && <p className="text-red-500 text-sm">{errors.consultation_id}</p>}
          </div>

          {/* Médicament */}
          <div>
            <label className="block text-sm font-medium">Médicament (liste)</label>
            <select
              name="medicament_id"
              value={form.medicament_id}
              onChange={handleChange}
              className="border rounded w-full px-3 py-2"
            >
              <option value="">-- Sélectionner un médicament --</option>
              {medicamentOptions.map((m) => (
                <option key={m.id} value={String(m.id)}>
                  {getMedLabel(m)}
                </option>
              ))}
            </select>
          </div>

          {/* Médicament libre */}
          <div>
            <label className="block text-sm font-medium">Médicament (saisie libre si non listé)</label>
            <input
              type="text"
              name="medicament_nom"
              value={form.medicament_nom}
              onChange={handleChange}
              className="border rounded w-full px-3 py-2"
              placeholder="Nom du médicament"
              disabled={!!form.medicament_id}
            />
            {errors.medicament_nom && <p className="text-red-500 text-sm">{errors.medicament_nom}</p>}
          </div>

          {/* Posologie */}
          <div>
            <label className="block text-sm font-medium">Posologie *</label>
            <input
              type="text"
              name="posologie"
              value={form.posologie}
              onChange={handleChange}
              className="border rounded w-full px-3 py-2"
              placeholder="Ex: 1 comprimé matin et soir"
            />
            {errors.posologie && <p className="text-red-500 text-sm">{errors.posologie}</p>}
          </div>

          {/* Durée */}
          <div>
            <label className="block text-sm font-medium">Durée *</label>
            <input
              type="text"
              name="duree"
              value={form.duree}
              onChange={handleChange}
              className="border rounded w-full px-3 py-2"
              placeholder="Ex: 7 jours"
            />
            {errors.duree && <p className="text-red-500 text-sm">{errors.duree}</p>}
          </div>

          {/* Quantité + Unité */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium">Quantité *</label>
              <input
                type="number"
                name="quantite"
                value={form.quantite}
                onChange={handleChange}
                className="border rounded w-full px-3 py-2"
                min="1"
                step="1"
              />
              {errors.quantite && <p className="text-red-500 text-sm">{errors.quantite}</p>}
            </div>

            <div style={{ width: 120 }}>
              <label className="block text-sm font-medium">Unité</label>
              <input
                type="text"
                name="unite"
                value={form.unite}
                onChange={handleChange}
                className="border rounded w-full px-2 py-2"
                placeholder="mg / ml / unité"
              />
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
              onClick={() => {
                onClose();
                setErrors({});
              }}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              disabled={submitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? (prescription ? "Mise à jour..." : "Enregistrement...") : prescription ? "Mettre à jour" : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
