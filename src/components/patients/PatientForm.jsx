// src/components/patients/PatientForm.jsx
import { useState } from "react";

export default function PatientForm({ onSave }) {
  const [nom, setNom] = useState("");
  const [age, setAge] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nom) return;
    onSave({ nom, age: parseInt(age, 10) });
    setNom("");
    setAge("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        placeholder="Nom du patient"
        className="border px-2 py-1 rounded"
      />
      <input
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        placeholder="Âge"
        className="border px-2 py-1 rounded"
      />
      <button
        type="submit"
        className="bg-green-500 text-white px-3 py-1 rounded"
      >
        Ajouter
      </button>
    </form>
  );
}
