import React, { useState } from "react";
import api from "../../../services/api";

export default function SoinsForm({ initialData, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    type_soin: initialData?.type_soin || "",
    observations: initialData?.observations || "",
    statut_validation: initialData?.statut_validation || "en_attente",
    hospitalisation_id: initialData?.hospitalisation_id || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialData?.id) {
        // Modifier
        await api.put(`/soins-infirmiers/${initialData.id}`, form);
      } else {
        // Créer
        await api.post("/soins-infirmiers", form);
      }
      onSuccess();
    } catch (err) {
      console.error("Erreur enregistrement soin :", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-6 space-y-4 w-full max-w-md"
      >
        <h2 className="text-xl font-semibold">
          {initialData?.id ? "Modifier un soin" : "Ajouter un soin"}
        </h2>

        <div>
          <label className="block font-medium">Type de soin</label>
          <input
            name="type_soin"
            value={form.type_soin}
            onChange={handleChange}
            required
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Observations</label>
          <textarea
            name="observations"
            value={form.observations}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Statut</label>
          <select
            name="statut_validation"
            value={form.statut_validation}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
          >
            <option value="en_attente">En attente</option>
            <option value="valide">Validé</option>
            <option value="rejete">Rejeté</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {initialData?.id ? "Modifier" : "Ajouter"}
          </button>
        </div>
      </form>
    </div>
  );
}
