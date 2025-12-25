import { useEffect, useState } from "react";
import { getAllPatients, deletePatient } from "../../api/patients";
import { toast } from "react-toastify";
import PatientModal from "./PatientModal";
import PatientDetailsModal from "./PatientDetailsModal";

export default function PatientList({ token }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await getAllPatients(token, { page, limit, search });
      setPatients(res.patients || []);
      setTotalPages(res.pages || 1);
    } catch {
      toast.error("❌ Impossible de charger les patients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [token, page, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce patient ?")) return;
    try {
      await deletePatient(token, id);
      toast.success("Patient supprimé ✅");
      fetchPatients();
    } catch {
      toast.error("❌ Échec suppression patient");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 🔍 Recherche */}
      <input
        type="text"
        placeholder="Rechercher..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded px-3 py-2 w-1/3"
      />

      {/* 📋 Tableau */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Nom complet</th>
              <th className="p-2 border">Sexe</th>
              <th className="p-2 border">Date naissance</th>
              <th className="p-2 border">Numéro dossier</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  Chargement...
                </td>
              </tr>
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  Aucun patient trouvé
                </td>
              </tr>
            ) : (
              patients.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-2 border">
                    {p.nom} {p.postnom || ""} {p.prenom || ""}
                  </td>
                  <td className="p-2 border">{p.sexe}</td>
                  <td className="p-2 border">{p.date_naissance}</td>
                  <td className="p-2 border">{p.numero_dossier}</td>
                  <td className="p-2 border space-x-2">
                    {/* 👁️ Voir détails */}
                    <button
                      onClick={() => {
                        setSelected(p);
                        setDetailsOpen(true);
                      }}
                      className="px-2 py-1 bg-blue-100 rounded hover:bg-blue-200"
                    >
                      👁️ Voir
                    </button>

                    {/* ✏️ Modifier */}
                    <button
                      onClick={() => {
                        setSelected(p);
                        setModalOpen(true);
                      }}
                      className="px-2 py-1 bg-yellow-100 rounded hover:bg-yellow-200"
                    >
                      Modifier
                    </button>

                    {/* ❌ Supprimer */}
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-2 py-1 bg-red-100 rounded hover:bg-red-200"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 📝 Modals */}
      <PatientModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={() => {
          fetchPatients();
          setModalOpen(false);
        }}
        patient={selected}
        token={token}
      />

      <PatientDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        patient={selected}
      />
    </div>
  );
}
