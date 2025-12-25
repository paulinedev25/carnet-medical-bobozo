// src/pages/admin/HospitalisationDetails.jsx
import { useParams } from "react-router-dom";

export default function HospitalisationDetails() {
  const { id } = useParams();

  // TODO: Fetch hospitalisation by id
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-4">Détails Hospitalisation #{id}</h2>
      <p>⚠️ À implémenter : affichage des infos du backend.</p>
    </div>
  );
}
