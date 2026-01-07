import { useEffect, useState } from "react";
import {
  getRendezVousByPatient,
  createRdv,
  updateRdv,
  deleteRdv,
} from "../../services/rendezvous.service";
import RdvForm from "../../components/rendezvous/RdvForm";

export default function RendezVousPage({ patientId }) {
  const [rdvs, setRdvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await getRendezVousByPatient(patientId);
        setRdvs(res.data);
      } catch (err) {
        setError("Impossible de charger les rendez‑vous");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [patientId]);

  const handleSubmit = async (data) => {
    try {
      if (editing) {
        await updateRdv(editing.id, data);
      } else {
        await createRdv(data);
      }
      const res = await getRendezVousByPatient(patientId);
      setRdvs(res.data);
      setEditing(null);
    } catch {
      setError("Erreur lors de l’enregistrement du rendez‑vous");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce rendez‑vous ?")) return;
    await deleteRdv(id);
    setRdvs((r) => r.filter((x) => x.id !== id));
  };

  if (loading) return <p>Chargement rendez‑vous...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Rendez‑vous</h2>

      <button
        onClick={() => setEditing({ patient_id: patientId })}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        + Nouveau rendez‑vous
      </button>

      {editing && (
        <RdvForm
          initialData={editing}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(null)}
        />
      )}

      {rdvs.length === 0 ? (
        <p>Aucun rendez‑vous planifié</p>
      ) : (
        <table className="w-full table-auto border">
          <thead className="bg-gray-100">
            <tr>
              <th>Date</th>
              <th>Motif</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {rdvs.map((r) => (
              <tr key={r.id} className="border-t">
                <td>{new Date(r.date_rendez_vous).toLocaleString()}</td>
                <td>{r.motif}</td>
                <td>
                  <button onClick={() => setEditing(r)} className="text-blue-600 mr-2">
                    ✏️
                  </button>
                  <button onClick={() => handleDelete(r.id)} className="text-red-600">
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
