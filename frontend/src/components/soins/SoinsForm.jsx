import { useState } from "react";

export default function SoinsForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    type_soin: initialData?.type_soin || "",
    observations: initialData?.observations || "",
    statut_validation: initialData?.statut_validation || "en_attente",
    hospitalisation_id: initialData?.hospitalisation_id,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded bg-white">
      <div>
        <label className="font-semibold">Type de soin</label>
        <input
          name="type_soin"
          value={form.type_soin}
          onChange={handleChange}
          required
          className="w-full border px-2 py-1"
        />
      </div>

      <div>
        <label className="font-semibold">Observations</label>
        <textarea
          name="observations"
          value={form.observations}
          onChange={handleChange}
          className="w-full border px-2 py-1"
        />
      </div>

      <div>
        <label className="font-semibold">Statut</label>
        <select
          name="statut_validation"
          value={form.statut_validation}
          onChange={handleChange}
          className="w-full border px-2 py-1"
        >
          <option value="en_attente">En attente</option>
          <option value="valide">Validé</option>
          <option value="rejete">Rejeté</option>
        </select>
      </div>

      <div className="flex gap-4">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Enregistrer
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">
          Annuler
        </button>
      </div>
    </form>
  );
}
