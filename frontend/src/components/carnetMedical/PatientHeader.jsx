export default function PatientHeader({ patient }) {
  if (!patient) return null;

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-lg font-semibold">
        🧑‍⚕️ {patient.nom} {patient.postnom || ""} {patient.prenom}
      </h2>

      <div className="text-sm text-gray-600 grid grid-cols-2 gap-2 mt-2">
        <div>📁 Dossier : {patient.numero_dossier}</div>
        <div>📞 Téléphone : {patient.telephone || "-"}</div>
        <div>⚥ Sexe : {patient.sexe}</div>
        <div>🎂 Naissance : {patient.date_naissance}</div>
        <div>🏠 Adresse : {patient.adresse}</div>
        <div>🧾 Matricule : {patient.matricule}</div>
      </div>
    </div>
  );
}
