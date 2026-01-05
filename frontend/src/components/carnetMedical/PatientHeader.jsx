// src/components/carnetMedical/PatientHeader.jsx
export default function PatientHeader({ patient }) {
  if (!patient) return null; // ✅ sécurité si patient undefined

  return (
    <div className="bg-white rounded p-4 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <div className="text-lg font-semibold">
        {patient.nom} {patient.postnom || ""} {patient.prenom}
      </div>
      <div className="text-sm text-gray-500">
        Dossier: {patient.numero_dossier || "-"} | Grade: {patient.grade || "-"} | Unité: {patient.unite || "-"}
      </div>
    </div>
  );
}
