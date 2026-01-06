import { useEffect, useState } from "react";
import { getRendezVousByPatient, deleteRdv } from "../../services/rendezvous.service";

export default function RendezVousTable({ patientId }) {
  const [rdvs, setRdvs] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await getRendezVousByPatient(patientId);
      setRdvs(res.data);
    }
    load();
  }, [patientId]);

  const handleDelete = async (id) => {
    await deleteRdv(id);
    setRdvs((r) => r.filter(x => x.id !== id));
  };

  return (
    <table>
      <thead>
        <tr><th>Date</th><th>Motif</th><th>Actions</th></tr>
      </thead>
      <tbody>
        {rdvs.map(r => (
          <tr key={r.id}>
            <td>{new Date(r.date_rendez_vous).toLocaleDateString()}</td>
            <td>{r.motif}</td>
            <td>
              <button onClick={() => handleDelete(r.id)}>Supprimer</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
