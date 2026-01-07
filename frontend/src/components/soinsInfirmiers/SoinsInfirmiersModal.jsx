import { useState, useEffect } from "react";

export default function SoinsInfirmiersModal({ open, onClose, onSave, soin }) {
  const [form, setForm] = useState({
    type_soin: "",
    observations: "",
    statut_validation: "en_attente",
    infirmier_id: "",
    medecin_id: "",
    date_soin: "",
  });

  useEffect(() => {
    if (soin) setForm(soin);
    else setForm({
      type_soin: "",
      observations: "",
      statut_validation: "en_attente",
      infirmier_id: "",
      medecin_id: "",
      date_soin: "",
    });
  }, [soin]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => onSave(form);

  if (!open) return null;
  return (
    <div className="modal fixed inset-0 flex justify-center items-center bg-black bg-opacity-25">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">{soin ? "Modifier soin" : "Ajouter soin"}</h2>
        <div className="space-y-3">
          <div>
            <label>Type soin</label>
            <input type="text" name="type_soin" value={form.type_soin} onChange={handleChange} className="border w-full p-2" />
          </div>
          <div>
            <label>Observations</label>
            <textarea name="observations" value={form.observations} onChange={handleChange} className="border w-full p-2" />
          </div>
          <div>
            <label>Date soin</label>
            <input type="datetime-local" name="date_soin" value={form.date_soin} onChange={handleChange} className="border w-full p-2" />
          </div>
          <div>
            <label>Statut</label>
            <select name="statut_validation" value={form.statut_validation} onChange={handleChange} className="border w-full p-2">
              <option value="en_attente">En attente</option>
              <option value="valide">Validé</option>
              <option value="rejete">Rejeté</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Annuler</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">Enregistrer</button>
        </div>
      </div>
    </div>
  );
}
