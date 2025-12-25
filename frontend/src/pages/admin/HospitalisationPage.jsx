// src/pages/admin/HospitalisationPage.jsx
import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../auth/AuthContext";

import {
  getHospitalisations,
  createHospitalisation,
  updateHospitalisation,
  deleteHospitalisation,
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

  const [openModal, setOpenModal] = useState(false);
  const [hospitalisationToEdit, setHospitalisationToEdit] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [selected, setSelected] = useState(null);

  // Charger hospitalisations
  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await getHospitalisations(token, { statut });
      // supporte soit array soit { rows, count } (selon backend)
      const items = Array.isArray(res) ? res : res.rows ?? [];
      setRows(items);
      // debug utile
      console.debug("Hospitalisations chargées:", items);
    } catch (err) {
      console.error("Erreur chargement hospitalisations:", err);
      toast.error("Impossible de charger les hospitalisations ❌");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [token, statut]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const columns = useMemo(
    () => ["#", "Patient", "Médecin", "Infirmier", "Date entrée", "Statut", "Actions"],
    []
  );

  const filteredRows = rows.filter((h) => {
    const searchLower = (search || "").toLowerCase();
    const matchesSearch =
      !searchLower ||
      (h.patient?.nom || "").toLowerCase().includes(searchLower) ||
      (h.patient?.prenom || "").toLowerCase().includes(searchLower) ||
      (h.medecin?.noms || "").toLowerCase().includes(searchLower) ||
      (h.infirmier?.noms || "").toLowerCase().includes(searchLower);
    const matchesStatut = statut ? h.statut === statut : true;
    return matchesSearch && matchesStatut;
  });

  const handleSave = async (payload) => {
    setSaving(true);
    try {
      if (hospitalisationToEdit?.id) {
        await updateHospitalisation(token, hospitalisationToEdit.id, payload);
        toast.success("✅ Hospitalisation mise à jour");
      } else {
        await createHospitalisation(token, payload);
        toast.success("✅ Hospitalisation créée");
      }
      setOpenModal(false);
      setHospitalisationToEdit(null);
      await loadData();
    } catch (err) {
      console.error("Erreur save hospitalisation:", err);
      const message = err?.error || err?.message || "❌ Échec sauvegarde hospitalisation";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Supprimer cette hospitalisation ?")) return;
    setSaving(true);
    try {
      await deleteHospitalisation(token, id);
      toast.success("🗑️ Hospitalisation supprimée");
      await loadData();
    } catch (err) {
      console.error("Erreur suppression:", err);
      toast.error(err?.error || "❌ Échec suppression");
    } finally {
      setSaving(false);
    }
  };

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

  const labelStatut = (s) => {
    if (!s) return "-";
    switch (s) {
      case "admise":
        return "Admise";
      case "en_cours":
        return "En cours";
      case "clôturée":
        return "Clôturée";
      default:
        return s;
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
            <option value="clôturée">Clôturée</option>
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

      {/* Tableau */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((c) => (
                <th key={c} className="px-4 py-2 text-left">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((h, idx) => (
              <tr key={h.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">👤 {h.patient?.nom} {h.patient?.postnom} {h.patient?.prenom}</td>
                <td className="px-4 py-2">🧑‍⚕️ {h.medecin?.noms || "-"}</td>
                <td className="px-4 py-2">🩺 {h.infirmier?.noms || "-"}</td>
                <td className="px-4 py-2">{formatDate(h.date_entree)}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${h.statut === "admise" ? "bg-blue-100 text-blue-700" : h.statut === "en_cours" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                    {labelStatut(h.statut)}
                  </span>
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => { setSelected(h); setOpenDetails(true); }}
                    className="px-2 py-1 rounded border hover:bg-gray-100"
                    title="Voir détails"
                  >
                    👁️
                  </button>
                  <button
                    onClick={() => { setHospitalisationToEdit(h); setOpenModal(true); }}
                    className="px-2 py-1 rounded border hover:bg-yellow-100"
                    title="Modifier"
                  >
                    ✏️
                  </button>
                  {user?.role === "admin" && (
                    <button onClick={() => handleDelete(h.id)} className="px-2 py-1 rounded border hover:bg-red-100" title="Supprimer">
                      🗑️
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!loading && filteredRows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center py-6 text-gray-500">Aucun enregistrement</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
