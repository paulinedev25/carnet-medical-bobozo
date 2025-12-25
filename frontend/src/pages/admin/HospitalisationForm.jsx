// src/pages/admin/HospitalisationForm.jsx
import { useState } from "react";

export default function HospitalisationForm() {
  const [patientId, setPatientId] = useState("");
  const [motif, setMotif] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("➡️ Nouvelle hospitalisation envoyée :", { patientId, motif });
    // TODO: POST vers backend
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-4">➕ Nouvelle hospitalisation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">ID Patient</label>
          <input
            type="text"
            className="border rounded p-2 w-full"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          />
        </div>
        <div>
          <label className="block">Motif</label>
          <input
            type="text"
            className="border rounded p-2 w-full"
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Enregistrer
        </button>
      </form>
    </div>
  );
}
