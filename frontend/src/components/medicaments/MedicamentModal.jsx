import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function MedicamentModal({ open, onClose, onSave, medicament }) {
  const initialState = {
    nom_commercial: "",
    unite_nom_commercial: "",
    nom_dci: "",
    unite_nom_dci: "",
    forme: "",
    unite_forme: "",
    dosage: "",
    voie_administration: "",
    quantite_disponible: 0,
    unite_quantite: "",
    seuil_alerte: 10,
    unite_seuil: "",
    date_expiration: "",
    fournisseur: "",
    observations: "",
  };

  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (open) {
      setForm(medicament ? { ...medicament } : initialState);
    }
  }, [open, medicament]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // --- VALIDATIONS ---
    if (!form.nom_commercial?.trim()) {
      toast.error("⚠️ Le nom commercial est obligatoire");
      return;
    }

    if (form.quantite_disponible < 0) {
      toast.error("⚠️ La quantité ne peut pas être négative");
      return;
    }

    if (form.seuil_alerte < 0) {
      toast.error("⚠️ Le seuil d'alerte ne peut pas être négatif");
      return;
    }

    if (form.date_expiration && isNaN(new Date(form.date_expiration).getTime())) {
      toast.error("⚠️ La date d'expiration est invalide");
      return;
    }

    // --- PREPARATION PAYLOAD ---
    const payload = {
      ...form,
      nom_commercial: form.nom_commercial.trim(),
      unite_nom_commercial: form.unite_nom_commercial?.trim() || null,
      nom_dci: form.nom_dci?.trim() || null,
      unite_nom_dci: form.unite_nom_dci?.trim() || null,
      forme: form.forme?.trim() || null,
      unite_forme: form.unite_forme?.trim() || null,
      dosage: form.dosage?.trim() || null,
      voie_administration: form.voie_administration?.trim() || null,
      quantite_disponible: Number(form.quantite_disponible),
      unite_quantite: form.unite_quantite?.trim() || null,
      seuil_alerte: Number(form.seuil_alerte),
      unite_seuil: form.unite_seuil?.trim() || null,
      date_expiration: form.date_expiration || null,
      fournisseur: form.fournisseur?.trim() || null,
      observations: form.observations?.trim() || null,
    };

    console.log("Payload envoyé :", payload); // <-- pour debug

    try {
      onSave(payload);
    } catch (err) {
      console.error("Erreur onSave :", err);
      toast.error("❌ Impossible d'envoyer le médicament");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          {medicament ? "✏️ Modifier un médicament" : "➕ Ajouter un médicament"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 grid grid-cols-2 gap-4">
          {/* Nom commercial + unité */}
          <div>
            <label className="block text-sm font-medium">Nom commercial *</label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                name="nom_commercial"
                value={form.nom_commercial}
                onChange={handleChange}
                className="flex-1 border rounded px-2 py-1"
                placeholder="Ex: Paracétamol"
                required
              />
              <input
                type="text"
                name="unite_nom_commercial"
                value={form.unite_nom_commercial}
                onChange={handleChange}
                className="w-20 border rounded px-2 py-1"
                placeholder="mg"
              />
            </div>
          </div>

          {/* Nom DCI + unité */}
          <div>
            <label className="block text-sm font-medium">Nom DCI</label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                name="nom_dci"
                value={form.nom_dci}
                onChange={handleChange}
                className="flex-1 border rounded px-2 py-1"
                placeholder="Ex: Acetaminophen"
              />
              <input
                type="text"
                name="unite_nom_dci"
                value={form.unite_nom_dci}
                onChange={handleChange}
                className="w-20 border rounded px-2 py-1"
                placeholder="mg"
              />
            </div>
          </div>

          {/* Forme + unité */}
          <div>
            <label className="block text-sm font-medium">Forme</label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                name="forme"
                value={form.forme}
                onChange={handleChange}
                className="flex-1 border rounded px-2 py-1"
                placeholder="Ex: Comprimé"
              />
              <input
                type="text"
                name="unite_forme"
                value={form.unite_forme}
                onChange={handleChange}
                className="w-20 border rounded px-2 py-1"
                placeholder="unité"
              />
            </div>
          </div>

          {/* Dosage */}
          <div>
            <label className="block text-sm font-medium">Dosage</label>
            <input
              type="text"
              name="dosage"
              value={form.dosage}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 mt-1"
              placeholder="Ex: 500 mg"
            />
          </div>

          {/* Voie d'administration */}
          <div>
            <label className="block text-sm font-medium">Voie d'administration</label>
            <input
              type="text"
              name="voie_administration"
              value={form.voie_administration}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 mt-1"
              placeholder="Ex: Orale"
            />
          </div>

          {/* Quantité disponible + unité */}
          <div>
            <label className="block text-sm font-medium">Quantité disponible</label>
            <div className="flex gap-2 mt-1">
              <input
                type="number"
                name="quantite_disponible"
                value={form.quantite_disponible}
                onChange={handleChange}
                className="flex-1 border rounded px-2 py-1"
                min="0"
              />
              <input
                type="text"
                name="unite_quantite"
                value={form.unite_quantite}
                onChange={handleChange}
                className="w-20 border rounded px-2 py-1"
                placeholder="comprimé"
              />
            </div>
          </div>

          {/* Seuil d'alerte + unité */}
          <div>
            <label className="block text-sm font-medium">Seuil d'alerte</label>
            <div className="flex gap-2 mt-1">
              <input
                type="number"
                name="seuil_alerte"
                value={form.seuil_alerte}
                onChange={handleChange}
                className="flex-1 border rounded px-2 py-1"
                min="0"
              />
              <input
                type="text"
                name="unite_seuil"
                value={form.unite_seuil}
                onChange={handleChange}
                className="w-20 border rounded px-2 py-1"
                placeholder="comprimé"
              />
            </div>
          </div>

          {/* Date expiration */}
          <div>
            <label className="block text-sm font-medium">Date d'expiration</label>
            <input
              type="date"
              name="date_expiration"
              value={form.date_expiration?.slice(0, 10) || ""}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 mt-1"
            />
          </div>

          {/* Fournisseur */}
          <div>
            <label className="block text-sm font-medium">Fournisseur</label>
            <input
              type="text"
              name="fournisseur"
              value={form.fournisseur}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1 mt-1"
            />
          </div>

          {/* Observations */}
          <div className="col-span-2">
            <label className="block text-sm font-medium">Observations</label>
            <textarea
              name="observations"
              value={form.observations}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded px-2 py-1 mt-1"
            />
          </div>
        </form>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {medicament ? "Mettre à jour" : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
}
