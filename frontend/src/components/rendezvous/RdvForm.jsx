import { useState } from "react";

export default function RdvForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    date_rendez_vous: initialData?.date_rendez_vous || "",
    motif: initialData?.motif || "",
    patient_id: initialData?.patient_id,
    medecin_id: initialData?.medecin_id || "",
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
        <label className="font-semibold">Date & heure</label>
        <input
          type="datetime-local"
          name="date_rendez_vous"
          value={form.date_rendez_vous}
          onChange={handleChange}
          required
          className="w-full border px-2 py-1"
        />
      </div>

      <div>
        <label className="font-semibold">Motif</label>
        <input
          name="motif"
          value={form.motif}
          onChange={handleChange}
          className="w-full border px-2 py-1"
        />
      </div>

      <div>
        <label className="font-semibold">Médecin ID</label>
        <input
          name="medecin_id"
          value={form.medecin_id}
          onChange={handleChange}
          className="w-full border px-2 py-1"
        />
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
