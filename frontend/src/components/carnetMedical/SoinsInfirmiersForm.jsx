import { useState, useEffect } from "react";

export default function SoinsInfirmiersForm({ initialData = {}, onSave, onCancel, infirmiers = [], medecins = [] }) {
  const [form, setForm] = useState({
    type_soin: "",
    date_soin: "",
    observations: "",
    tension: "",
    pouls: "",
    temperature: "",
    parametres_vitaux: "",
    infirmier_id: "",
    medecin_id: "",
    statut_validation: "en_attente",
    ...initialData,
  });

  useEffect(() => {
    if (initialData?.date_soin) {
      setForm((f) => ({ ...f, date_soin: new Date(initialData.date_soin).toISOString().slice(0, 16) }));
    }
  }, [initialData]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow-md">
      {/* TITRE */}
      <h2 className="text-lg font-semibold text-gray-800">
        {initialData.id ? "Modifier le soin" : "Ajouter un soin infirmier"}
      </h2>

      {/* TYPE DE SOIN */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Type de soin *</label>
        <input
          type="text"
          name="type_soin"
          value={form.type_soin}
          onChange={handleChange}
          required
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* DATE & HEURE */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Date et Heure *</label>
        <input
          type="datetime-local"
          name="date_soin"
          value={form.date_soin}
          onChange={handleChange}
          required
          className="mt-1 block w-full border-gray-300 rounded-md"
        />
      </div>

      {/* INFIRMIER */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Infirmier responsable *</label>
        <select
          name="infirmier_id"
          value={form.infirmier_id}
          onChange={handleChange}
          required
          className="mt-1 block w-full border-gray-300 rounded-md"
        >
          <option value="">-- Choisir infirmier --</option>
          {infirmiers.map((u) => (
            <option key={u.id} value={u.id}>
              {u.noms}
            </option>
          ))}
        </select>
      </div>

      {/* MÉDECIN VALIDATEUR */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Médecin validateur</label>
        <select
          name="medecin_id"
          value={form.medecin_id}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md"
        >
          <option value="">-- Aucun --</option>
          {medecins.map((m) => (
            <option key={m.id} value={m.id}>
              {m.noms}
            </option>
          ))}
        </select>
      </div>

      {/* STATUT */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Statut de validation</label>
        <select
          name="statut_validation"
          value={form.statut_validation}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md"
        >
          <option value="en_attente">En attente</option>
          <option value="valide">Validé</option>
          <option value="rejete">Rejeté</option>
        </select>
      </div>

      {/* OBSERVATIONS */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Observations infirmier</label>
        <textarea
          name="observations"
          value={form.observations}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full border-gray-300 rounded-md"
        />
      </div>

      {/* PARAMÈTRES VITAUX */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tension artérielle</label>
          <input
            type="text"
            name="tension"
            value={form.tension}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Pouls</label>
          <input
            type="number"
            name="pouls"
            value={form.pouls}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Température</label>
          <input
            type="number"
            step="0.1"
            name="temperature"
            value={form.temperature}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* BOUTONS */}
      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          {initialData.id ? "Mettre à jour" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
