// src/pages/admin/MedicamentsPage.jsx
import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";

import {
  getMedicaments,
  createMedicament,
  updateMedicament,
  deleteMedicament,
} from "../../api/medicaments";
import { createApprovisionnement, getHistoriqueApprovisionnement } from "../../api/approvisionnements";

import MedicamentModal from "../../components/medicaments/MedicamentModal";
import ApprovisionnementModal from "../../components/medicaments/ApprovisionnementModal";
import ApprovisionnementHistoriqueModal from "../../components/medicaments/ApprovisionnementHistoriqueModal";

export default function MedicamentsPage() {

  // --- STATE ---
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [sortBy, setSortBy] = useState("nom_commercial");
  const [sortOrder, setSortOrder] = useState("asc");

  const [filterLowStock, setFilterLowStock] = useState(false);
  const lowStockThreshold = 5;

  const [openMedicamentModal, setOpenMedicamentModal] = useState(false);
  const [openApproModal, setOpenApproModal] = useState(false);
  const [openHistoriqueModal, setOpenHistoriqueModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [historique, setHistorique] = useState([]);

  // --- UTILITY ---
  const displayWithUnit = (value, unit) => `${value ?? "-"} ${unit || ""}`.trim();

  // --- LOAD MEDICAMENTS ---
  const loadMedicaments = useCallback(async () => {
  setLoading(true);
  try {
    const data = await getMedicaments();
    setRows(Array.isArray(data) ? data : []);
  } catch (err) {
    toast.error("❌ Impossible de charger les médicaments");
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => { loadMedicaments(); }, [loadMedicaments]);

  // --- FILTER ---
  const filteredRows = useMemo(() => {
    let result = rows ?? [];
    const q = (search || "").trim().toLowerCase();
    if (q) {
      result = result.filter(
        (m) =>
          (m.nom_commercial || "").toLowerCase().includes(q) ||
          (m.nom_dci || "").toLowerCase().includes(q) ||
          (m.forme || "").toLowerCase().includes(q)
      );
    }
    if (filterLowStock) {
      result = result.filter((m) => (m.quantite_disponible ?? 0) < lowStockThreshold);
    }
    return result;
  }, [rows, search, filterLowStock]);

  // --- SORT ---
  const sortedRows = useMemo(() => {
    const arr = [...filteredRows];
    arr.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }
      const sa = String(aVal ?? "").toLowerCase();
      const sb = String(bVal ?? "").toLowerCase();
      if (sa < sb) return sortOrder === "asc" ? -1 : 1;
      if (sa > sb) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filteredRows, sortBy, sortOrder]);

  // --- PAGINATION ---
  const totalPages = Math.max(1, Math.ceil(sortedRows.length / rowsPerPage));
  const paginatedRows = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sortedRows.slice(start, start + rowsPerPage);
  }, [sortedRows, page]);

  // --- STATS ---
  const totalStock = useMemo(
    () => filteredRows.reduce((sum, m) => sum + (Number(m.quantite_disponible) || 0), 0),
    [filteredRows]
  );

  // --- SORT TOGGLE ---
  const toggleSort = (key) => {
    if (sortBy === key) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  // --- CRUD HANDLERS ---
  const handleAdd = async (payload) => {
  setSaving(true);
  try {
    await createMedicament(payload);
    toast.success("✅ Médicament ajouté");
    setOpenMedicamentModal(false);
    await loadMedicaments();
  } catch (err) {
    toast.error(err?.response?.data?.error || "❌ Échec ajout médicament");
  } finally {
    setSaving(false);
  }
};

  const handleEdit = async (id, payload) => {
  setSaving(true);
  try {
    await updateMedicament(id, payload);
    toast.success("✅ Médicament mis à jour");
    setOpenMedicamentModal(false);
    setSelected(null);
    await loadMedicaments();
  } catch (err) {
    toast.error(err?.response?.data?.error || "❌ Échec modification");
  } finally {
    setSaving(false);
  }
};

  const handleDelete = async (id) => {
  if (!window.confirm("⚠️ Voulez-vous vraiment supprimer ce médicament ?")) return;
  setSaving(true);
  try {
    await deleteMedicament(id);
    toast.success("🗑️ Médicament supprimé");
    await loadMedicaments();
  } catch (err) {
    toast.error(err?.response?.data?.error || "❌ Échec suppression");
  } finally {
    setSaving(false);
  }
};

  // --- APPROVISIONNEMENT ---
  const handleApprovisionnement = async (payload) => {
    if (!selected?.id) { toast.error("⚠️ Aucun médicament sélectionné."); return; }
    setSaving(true);
    try {
      await createApprovisionnement({ medicament_id: selected.id, ...payload });
      toast.success("✅ Approvisionnement enregistré");
      setOpenApproModal(false);
      setSelected(null);
      await loadMedicaments();
    } catch (err) {
      console.error("Erreur approvisionnement:", err?.response?.data || err);
      toast.error(err?.response?.data?.error || "❌ Échec approvisionnement");
    } finally { setSaving(false); }
  };

  // --- HISTORIQUE ---
  const handleOpenHistorique = async (medicament) => {
    setSelected(medicament);
    setOpenHistoriqueModal(true);
    try {
      const data = await getHistoriqueApprovisionnement(medicament.id);
      setHistorique(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur chargement historique :", err?.response?.data || err);
      toast.error("❌ Impossible de charger l'historique");
      setHistorique([]);
    }
  };

  // --- EXPORT ---
  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text("Liste des médicaments", 14, 15);
      if (typeof doc.autoTable === "function") {
        doc.autoTable({
          startY: 20,
          head: [["#", "Nom commercial", "DCI", "Forme", "Quantité", "Seuil d'alerte"]],
          body: sortedRows.map((m, i) => [
            i + 1,
            displayWithUnit(m.nom_commercial, m.unite_nom_commercial),
            displayWithUnit(m.nom_dci, m.unite_nom_dci),
            displayWithUnit(m.forme, m.unite_forme),
            displayWithUnit(m.quantite_disponible, m.unite_quantite),
            displayWithUnit(m.seuil_alerte, m.unite_seuil),
          ]),
        });
      }
      doc.save("medicaments.pdf");
    } catch (err) {
      console.error("Erreur export PDF :", err);
      toast.error("❌ Impossible d'exporter en PDF");
    }
  };

  const handleExportCSV = () => {
    try {
      const header = ["#", "Nom commercial", "DCI", "Forme", "Quantité", "Seuil d'alerte"];
      const rowsCSV = sortedRows.map((m, i) => [
        i + 1,
        `"${displayWithUnit(m.nom_commercial, m.unite_nom_commercial)}"`,
        `"${displayWithUnit(m.nom_dci, m.unite_nom_dci)}"`,
        `"${displayWithUnit(m.forme, m.unite_forme)}"`,
        `"${displayWithUnit(m.quantite_disponible, m.unite_quantite)}"`,
        `"${displayWithUnit(m.seuil_alerte, m.unite_seuil)}"`,
      ]);
      const csvContent = [header, ...rowsCSV].map((r) => r.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "medicaments.csv"; a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erreur export CSV :", err);
      toast.error("❌ Impossible d'exporter en CSV");
    }
  };

  // --- TABLE COLUMNS ---
  const columns = useMemo(
    () => [
      { key: "id", label: "#" },
      { key: "nom_commercial", label: "Nom commercial" },
      { key: "nom_dci", label: "DCI" },
      { key: "forme", label: "Forme" },
      { key: "quantite_disponible", label: "Quantité" },
      { key: "seuil_alerte", label: "Seuil d'alerte" },
    ],
    []
  );

  // --- RENDER ---
  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex flex-wrap justify-between mb-4 gap-2 items-center">
        <h1 className="text-xl font-semibold">💊 Médicaments</h1>
        <div className="flex flex-wrap gap-2 items-center">
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="🔍 Rechercher un médicament..."
            className="border rounded px-3 py-2"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={filterLowStock}
              onChange={(e) => { setFilterLowStock(e.target.checked); setPage(1); }}
            />
            Stock faible (&lt; {lowStockThreshold})
          </label>
          <button
            onClick={() => { setSelected(null); setOpenMedicamentModal(true); }}
            disabled={saving}
            className="px-3 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            + Nouveau
          </button>
          <button
            onClick={handleExportPDF}
            disabled={!sortedRows.length}
            className="px-3 py-2 rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
          >
            📄 PDF
          </button>
          <button
            onClick={handleExportCSV}
            disabled={!sortedRows.length}
            className="px-3 py-2 rounded bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
          >
            📊 CSV
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="bg-gray-100 rounded p-3 mb-4 flex justify-between text-sm">
        <span>📦 Total stock : <strong>{totalStock}</strong></span>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        {loading ? (
          <div className="text-center py-6 text-gray-500">⏳ Chargement...</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-2 text-left cursor-pointer select-none"
                    onClick={() => toggleSort(col.key)}
                  >
                    {col.label}
                    {sortBy === col.key && <span> {sortOrder === "asc" ? "🔼" : "🔽"}</span>}
                  </th>
                ))}
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRows.map((m, idx) => (
                <tr key={m.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{(page - 1) * rowsPerPage + idx + 1}</td>
                  <td className="px-4 py-2 font-medium">{displayWithUnit(m.nom_commercial, m.unite_nom_commercial)}</td>
                  <td className="px-4 py-2">{displayWithUnit(m.nom_dci, m.unite_nom_dci)}</td>
                  <td className="px-4 py-2">{displayWithUnit(m.forme, m.unite_forme)}</td>
                  <td className={`px-4 py-2 ${Number(m.quantite_disponible ?? 0) < lowStockThreshold ? "text-red-600 font-bold" : ""}`}>
                    {displayWithUnit(m.quantite_disponible, m.unite_quantite)}
                  </td>
                  <td>{displayWithUnit(m.seuil_alerte, m.unite_seuil)}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => { setSelected(m); setOpenApproModal(true); }}
                      className="px-2 py-1 rounded border hover:bg-green-100"
                      title="Approvisionner"
                    >📦</button>

                    <button
                      onClick={() => { setSelected(m); setOpenMedicamentModal(true); }}
                      className="px-2 py-1 rounded border hover:bg-yellow-100"
                      title="Modifier"
                    >✏️</button>

                    <button
                      onClick={() => handleOpenHistorique(m)}
                      className="px-2 py-1 rounded border hover:bg-blue-100"
                      title="Historique"
                    >📊</button>

                    <button
                      onClick={() => handleDelete(m.id)}
                      className="px-2 py-1 rounded border hover:bg-red-100"
                      title="Supprimer"
                    >🗑️</button>
                  </td>
                </tr>
              ))}
              {!loading && paginatedRows.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center py-6 text-gray-500">
                    Aucun médicament trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >⬅️ Précédent</button>
          <span>Page {page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          >Suivant ➡️</button>
        </div>
      )}

      {/* MODALES */}
      <MedicamentModal
        open={openMedicamentModal}
        onClose={() => { setOpenMedicamentModal(false); setSelected(null); }}
        onSave={(payload) => (selected ? handleEdit(selected.id, payload) : handleAdd(payload))}
        medicament={selected}
      />

      <ApprovisionnementModal
        open={openApproModal}
        onClose={() => { setOpenApproModal(false); setSelected(null); }}
        onSave={handleApprovisionnement}
        medicament={selected}
      />

      <ApprovisionnementHistoriqueModal
        open={openHistoriqueModal}
        onClose={() => { setOpenHistoriqueModal(false); setSelected(null); setHistorique([]); }}
        medicament={selected}
        historique={historique}
      />
    </div>
  );
}
