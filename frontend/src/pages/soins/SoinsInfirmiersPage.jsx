import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getSoinsByHospitalisation,
  createSoin,
  updateSoin,
  deleteSoin,
} from "../../services/soins.service";
import SoinsForm from "../../components/soins/SoinsForm";

export default function SoinsInfirmiersPage() {
  const { hospitalisationId, patientId } = useParams();
  const [soins, setSoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await getSoinsByHospitalisation(hospitalisationId);
        setSoins(res.data);
      } catch (err) {
        setError("Impossible de charger les soins");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [hospitalisationId]);

  const handleSubmit = async (data) => {
    try {
      if (editing) {
        await updateSoin(editing.id, data);
      } else {
        await createSoin(data);
      }
      // reload
      const res = await getSoinsByHospitalisation(hospitalisationId);
      setSoins(res.data);
      setEditing(null);
    } catch (err) {
      setError("Erreur lors de l’enregistrement");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce soin ?")) return;
    await deleteSoin(id);
    setSoins((s) => s.filter((soin) => soin.id !== id));
  };

  if (loading) return <p>Chargement des soins...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Soins infirmiers</h2>

      <button
        onClick={() => setEditing({ hospitalisation_id: hospitalisationId })}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        + Ajouter soin
      </button>

      {editing && (
        <SoinsForm
          initialData={editing}
          onCancel={() => setEditing(null)}
          onSubmit={handleSubmit}
        />
      )}

      {soins.length === 0 ? (
        <p>Aucun soin infirmier trouvé</p>
      ) : (
        <table className="w-full table-auto border">
          <thead className="bg-gray-100">
            <tr>
              <th>Date</th>
              <th>Type de soin</th>
              <th>Observations</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {soins.map((s) => (
              <tr key={s.id} className="border-t">
                <td>{new Date(s.date_soin).toLocaleString()}</td>
                <td>{s.type_soin}</td>
                <td>{s.observations}</td>
                <td>{s.statut_validation}</td>
                <td>
                  <button
                    onClick={() => setEditing(s)}
                    className="text-blue-600 mr-2"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-red-600"
                  >
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
