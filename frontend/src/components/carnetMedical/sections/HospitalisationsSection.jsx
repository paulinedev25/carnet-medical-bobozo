export default function HospitalisationsSection({ hospitalisations = [] }) {
  if (!hospitalisations.length) {
    return <p className="text-gray-500">Aucune hospitalisation</p>;
  }

  return (
    <div className="space-y-2">
      {hospitalisations.map((h) => (
        <div
          key={h.id}
          className="border rounded p-3 bg-white shadow-sm"
        >
          <p>
            <b>Service :</b> {h.service || "-"}
          </p>
          <p>
            <b>Date entrée :</b> {h.date_entree}
          </p>
          <p>
            <b>Statut :</b> {h.statut}
          </p>
        </div>
      ))}
    </div>
  );
}
