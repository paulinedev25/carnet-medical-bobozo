export default function PatientHeader({ patient }) {
  if (!patient) {
    return null;
  }

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-xl font-bold">
        {patient.nom} {patient.postnom || ""} {patient.prenom || ""}
      </h2>

      <p className="text-gray-600">
        Sexe : {patient.sexe} | Né(e) le : {patient.date_naissance}
      </p>

      <p className="text-gray-600">
        N° dossier : <b>{patient.numero_dossier}</b>
      </p>
    </div>
  );
}
