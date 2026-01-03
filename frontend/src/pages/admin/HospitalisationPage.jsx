// src/pages/admin/HospitalisationPage.jsx
import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../auth/AuthContext";

import {
  getHospitalisations,
  createHospitalisation,
  updateHospitalisation,
  deleteHospitalisation,
  getHospitalisationDashboard,
  changerStatutHospitalisation,
} from "../../api/hospitalisations";

import HospitalisationModal from "../../components/hospitalisations/HospitalisationModal";
import HospitalisationDetailsModal from "../../components/hospitalisations/HospitalisationDetailsModal";

export default function HospitalisationPage() {
  const { token, user } = useAuth();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [statut, setStatut] = useState("");

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [openModal, setOpenModal] = useState(false);
  const [hospitalisationToEdit, setHospitalisationToEdit] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [selected, setSelected] = useState(null);

  const [dashboard, setDashboard] = useState(null);

  // 🔄 Charger hospitalisations
  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await getHospitalisations({ statut, page, limit: rowsPerPage });
      const items = Array.isArray(res?.rows) ? res.rows : Array.isArray(res) ? res : [];

      // ✅ Normalisation patients, medecins et infirmiers
      const normalized = items.map((h) => ({
        ...h,
        patient: h.patient || { nom: "-", postnom: "", prenom: "" },
        medecin: h.medecin || { noms: "-" },
        infirmier: h.infirmier || { noms: "-" },
      }));

      setRows(normalized);
    } catch (err) {
      console.error("Erreur chargement hospitalisations:", err);
      toast.error("Impossible de charger les hospitalisations ❌");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [token, statut, page]);

  // 🔄 Charger dashboard (backend brut)
  const loadDashboard = useCallback(async () => {
    if (!token) return;
    try {
      const data = await getHospitalisationDashboard();
      setDashboard(data);
    } catch (err) {
      console.error("Erreur dashboard:", err);
      toast.error("Impossible de charger le dashboard ❌");
      setDashboard(null);
    }
  }, [token]);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  // ✅ Normalisation dashboard
  const dashboardStats = useMemo(() => {
    const stats = { total: dashboard?.total || 0, admises: 0, enCours: 0, cloturees: 0 };
    if (Array.isArray(dashboard?.parStatut)) {
      dashboard.parStatut.forEach((s) => {
        if (s.statut === "admise") stats.admises = Number(s.total) || 0;
        if (s.statut === "en_cours") stats.enCours = Number(s.total) || 0;
        if (s.statut === "cloturee") stats.cloturees = Number(s.total) || 0;
      });
    }
    return stats;
  }, [dashboard]);

  // Colonnes tableau
  const columns = useMemo(
    () => ["#", "Patient", "Médecin", "Infirmier", "Date entrée", "Statut", "Actions"],
    []
  );

  // 🔍 Filtrage
  const filteredRows = rows.filter((h) => {
    const s = (search || "").toLowerCase();
    const matchesSearch =
      !s ||
      (h.patient?.nom || "").toLowerCase().includes(s) ||
      (h.patient?.prenom || "").toLowerCase().includes(s) ||
      (h.medecin?.noms || "").toLowerCase().includes(s) ||
      (h.infirmier?.noms || "").toLowerCase().includes(s);

    const matchesStatut = statut ? h.statut === statut : true;
    return matchesSearch && matchesStatut;
  });

  // 📄 Pagination
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const paginatedRows = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredRows.slice(start, start + rowsPerPage);
  }, [filteredRows, page]);

  // 📅 Format date
  const formatDate = (d) => {
    if (!d) return "-";
    try {
      return new Date(d).toLocaleString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return d;
    }
  };

  // 🏷️ Label statut
  const labelStatut = (s) => {
    if (!s) return "-";
    if (s === "admise") return "Admise";
    if (s === "en_cours") return "En cours";
    if (s === "cloturee") return "Clôturée";
    return s;
  };

  // 🔄 Changer statut
  const handleChangerStatut = async (h) => {
    const next = h.statut === "admise"
      ? "en_cours"
      : h.statut === "en_cours"
      ? "cloturee"
      : "admise";
    try {
      await changerStatutHospitalisation(h.id, { statut: next });
      toast.success(`Statut changé en ${labelStatut(next)}`);
      await loadData();
      await loadDashboard();
    } catch (err) {
      console.error("Erreur changement statut:", err);
      toast.error("❌ Échec changement statut");
    }
  };

  // 💾 CRUD
  const handleSave = async (payload) => {
    setSaving(true);
    try {
      if (hospitalisationToEdit?.id) {
        await updateHospitalisation(hospitalisationToEdit.id, payload);
        toast.success("✅ Hospitalisation mise à jour");
      } else {
        await createHospitalisation(payload);
        toast.success("✅ Hospitalisation créée");
      }
      setOpenModal(false);
      setHospitalisationToEdit(null);
      await loadData();
      await loadDashboard();
    } catch (err) {
      console.error("Erreur save hospitalisation:", err);
      toast.error("❌ Échec sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Supprimer cette hospitalisation ?")) return;
    setSaving(true);
    try {
      await deleteHospitalisation(id);
      toast.success("🗑️ Hospitalisation supprimée");
      await loadData();
      await loadDashboard();
    } catch (err) {
      console.error("Erreur suppression:", err);
      toast.error("❌ Échec suppression");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">🏥 Hospitalisations</h1>
        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Rechercher patient / médecin / infirmier"
            className="border rounded px-3 py-2"
          />
          <select
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">Tous statuts</option>
            <option value="admise">Admise</option>
            <option value="en_cours">En cours</option>
            <option value="cloturee">Clôturée</option>
          </select>
          <button
            disabled={saving}
            onClick={() => {
              setHospitalisationToEdit(null);
              setOpenModal(true);
            }}
            className={`px-3 py-2 rounded text-white ${saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {saving ? "..." : "+ Nouvelle"}
          </button>
        </div>
      </div>

      {/* Dashboard */}
      {dashboard && (
        <div className="mb-4 flex gap-4 text-sm">
          <div className="bg-gray-100 rounded p-2">📦 Total: {dashboardStats.total}</div>
          <div className="bg-blue-100 rounded p-2 text-blue-700">Admis: {dashboardStats.admises}</div>
          <div className="bg-yellow-100 rounded p-2 text-yellow-700">En cours: {dashboardStats.enCours}</div>
          <div className="bg-green-100 rounded p-2 text-green-700">Clôturées: {dashboardStats.cloturees}</div>
        </div>
      )}

      {/* Tableau */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>{columns.map((c) => <th key={c} className="px-4 py-2 text-left">{c}</th>)}</tr>
          </thead>
          <tbody>
            {paginatedRows.map((h, idx) => (
              <tr key={h.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{(page - 1) * rowsPerPage + idx + 1}</td>
                <td className="px-4 py-2">{h.patient.nom} {h.patient.postnom || ""} {h.patient.prenom}</td>
                <td className="px-4 py-2">{h.medecin.noms}</td>
                <td className="px-4 py-2">{h.infirmier.noms}</td>
                <td className="px-4 py-2">{formatDate(h.date_entree)}</td>
                <td className="px-4 py-2">
                  <span
                    onClick={() => handleChangerStatut(h)}
                    className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer ${
                      h.statut === "admise"
                        ? "bg-blue-100 text-blue-700"
                        : h.statut === "en_cours"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {labelStatut(h.statut)}
                  </span>
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => { setSelected(h); setOpenDetails(true); }}
                    className="px-2 py-1 rounded border hover:bg-gray-100"
                  >👁️</button>
                  <button
                    onClick={() => { setHospitalisationToEdit(h); setOpenModal(true); }}
                    className="px-2 py-1 rounded border hover:bg-yellow-100"
                  >✏️</button>
                  {user?.role === "admin" && (
                    <button
                      onClick={() => handleDelete(h.id)}
                      className="px-2 py-1 rounded border hover:bg-red-100"
                    >🗑️</button>
                  )}
                </td>
              </tr>
            ))}
            {!loading && paginatedRows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center py-6 text-gray-500">
                  Aucun enregistrement
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded border bg-gray-100 disabled:opacity-50"
          >⬅️ Précédent</button>
          <span>Page {page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded border bg-gray-100 disabled:opacity-50"
          >Suivant ➡️</button>
        </div>
      )}

      {/* Modales */}
      <HospitalisationModal
        open={openModal}
        onClose={() => { setOpenModal(false); setHospitalisationToEdit(null); }}
        onSave={handleSave}
        hospitalisation={hospitalisationToEdit}
      />
      <HospitalisationDetailsModal
        open={openDetails}
        onClose={() => { setOpenDetails(false); setSelected(null); }}
        hospitalisation={selected}
      />
    </div>
  );
}
