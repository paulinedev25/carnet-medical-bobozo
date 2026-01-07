import { useState, useMemo } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useSoinsInfirmiers } from "../../hooks/useSoinsInfirmiers";
import SoinsInfirmiersModal from "../../components/soinsInfirmiers/SoinsInfirmiersModal";
import SoinsInfirmiersDetailsModal from "../../components/soinsInfirmiers/SoinsInfirmiersDetailsModal";
import { toast } from "react-toastify";

export default function SoinsInfirmiersPage({ patientId }) {
  const { user } = useAuth();
  const {
    rows: soins,
    loading,
    add,
    edit,
    remove,
    reload,
  } = useSoinsInfirmiers(patientId);

  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selected, setSelected] = useState(null);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return soins;
    return soins.filter((s) =>
      (s.type_soin || "").toLowerCase().includes(q) ||
      (s.infirmier?.noms || "").toLowerCase().includes(q)
    );
  }, [search, soins]);

  const onSave = async (payload) => {
    try {
      if (selected) {
        await edit(selected.id, payload);
        toast.success("✅ Soin mis à jour");
      } else {
        await add(payload);
        toast.success("🩺 Soin ajouté");
      }
      setOpenModal(false);
      setSelected(null);
    } catch (err) {
      console.error("Erreur soin infirmier", err);
      toast.error("❌ Échec opération");
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Supprimer ce soin ?")) return;
    try {
      await remove(id);
      toast.success("🗑️ Soin supprimé");
    } catch (err) {
      toast.error("❌ Impossible de supprimer");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">🩹 Soins infirmiers</h1>
        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Rechercher type / infirmier"
            className="border rounded px-3 py-2"
          />
          <button
            onClick={() => { setSelected(null); setOpenModal(true); }}
            className="bg-blue-600 text-white px-3 py-2 rounded"
          >
            + Ajouter soin
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        {loading ? (
          <div className="py-6 text-center text-gray-500">Chargement...</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["#", "Type soin", "Infirmier", "Médecin", "Date", "Statut", "Actions"].map((c) => (
                  <th key={c} className="px-4 py-2 text-left">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.length ? (
                filteredRows.map((s, idx) => (
                  <tr key={s.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">{s.type_soin || "-"}</td>
                    <td className="px-4 py-2">{s.infirmier?.noms || "-"}</td>
                    <td className="px-4 py-2">{s.medecin?.noms || "-"}</td>
                    <td className="px-4 py-2">{new Date(s.date_soin).toLocaleString()}</td>
                    <td className="px-4 py-2">{s.statut_validation}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button onClick={() => { setSelected(s); setOpenDetails(true); }}>👁️</button>
                      <button onClick={() => { setSelected(s); setOpenModal(true); }}>✏️</button>
                      <button onClick={() => onDelete(s.id)}>🗑️</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-gray-500">
                    Aucun soin infirmier
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <SoinsInfirmiersModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={onSave}
        soin={selected}
      />

      <SoinsInfirmiersDetailsModal
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        soin={selected}
      />
    </div>
  );
}
