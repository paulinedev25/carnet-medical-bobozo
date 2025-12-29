// src/pages/admin/PatientsPage.jsx
import { useState, useMemo } from "react";
import { useAuth } from "../../auth/AuthContext";
import { usePatients } from "../../hooks/usePatients";
import PatientModal from "../../components/patients/PatientModal";
import PatientDetailsModal from "../../components/patients/PatientDetailsModal"; // 👁️ nouveau import

export default function PatientsPage() {
  const { user } = useAuth();
  const {
    rows, count, page, limit, search, loading, canWrite,
    setPage, setLimit, setSearch,
    add, edit, remove,
  } = usePatients();

  const [openModal, setOpenModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const [openDetails, setOpenDetails] = useState(false); // 👁️ état pour les détails
  const [selectedDetails, setSelectedDetails] = useState(null);

  const totalPages = Math.max(1, Math.ceil(count / limit));
  const startIdx = (page - 1) * limit + 1;
  const endIdx = Math.min(count, page * limit);

  const columns = useMemo(
    () => ["#", "Nom complet", "Sexe", "Naissance", "N° dossier", "Adresse", "Actions"],
    []
  );

  // Création patient
  const onAdd = async (payload) => {
    try {
      await add(payload);
    } catch (err) {
      console.error("Erreur ajout patient", err);
    } finally {
      setOpenModal(false);
    }
  };

  // Modification patient
  const onEdit = async (payload) => {
    if (!selected) return;
    try {
      await edit(selected.id, payload);
    } catch (err) {
      console.error("Erreur maj patient", err);
    } finally {
      setSelected(null);
      setOpenModal(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header + recherche */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Patients</h1>

        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher (nom, prénom, n° dossier)"
            className="border rounded px-3 py-2"
          />
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="border rounded px-3 py-2"
          >
            {[10, 20, 50].map((n) => <option key={n} value={n}>{n}/page</option>)}
          </select>
          {canWrite && (
            <button
              onClick={() => { setSelected(null); setOpenModal(true); }}
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              + Nouveau
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow">
        <div className="px-4 py-2 text-sm text-gray-600">
          {loading ? "Chargement..." : `Affichage ${startIdx}-${endIdx} sur ${count}`}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((c) => (
                  <th key={c} className="text-left px-4 py-2 font-medium">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((p, idx) => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-2">{(page - 1) * limit + idx + 1}</td>
                  <td className="px-4 py-2 font-medium">
                    {[p.nom, p.postnom, p.prenom].filter(Boolean).join(" ")}
                  </td>
                  <td className="px-4 py-2">{p.sexe}</td>
                  <td className="px-4 py-2">{(p.date_naissance || "").slice(0, 10)}</td>
                  <td className="px-4 py-2">{p.numero_dossier || "-"}</td>
                  <td className="px-4 py-2">{p.adresse || "-"}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      {/* 👁️ Bouton Voir */}
                      <button
                        className="px-2 py-1 rounded border text-blue-600"
                        onClick={() => { setSelectedDetails(p); setOpenDetails(true); }}
                      >
                        👁️ Voir
                      </button>
                      <button
                        className="px-2 py-1 rounded border"
                        onClick={() => { setSelected(p); setOpenModal(true); }}
                        disabled={!canWrite}
                      >
                        Éditer
                      </button>
                      <button
                        className="px-2 py-1 rounded border text-red-600"
                        onClick={() => remove(p.id)}
                        disabled={!canWrite}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-500">
                    Aucun patient
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-gray-600">
            Page {page} / {totalPages}
          </span>
          <div className="flex gap-2">
            <button onClick={() => setPage(1)} disabled={page === 1} className="px-3 py-1 border rounded">«</button>
            <button onClick={() => setPage(page - 1)} disabled={page === 1} className="px-3 py-1 border rounded">Préc.</button>
            <button onClick={() => setPage(page + 1)} disabled={page >= totalPages} className="px-3 py-1 border rounded">Suiv.</button>
            <button onClick={() => setPage(totalPages)} disabled={page >= totalPages} className="px-3 py-1 border rounded">»</button>
          </div>
        </div>
      </div>

      {/* Modal ajout/édition */}
      <PatientModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={selected ? onEdit : onAdd}
        patient={selected}
      />

      {/* Modal détails 👁️ */}
      <PatientDetailsModal
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        patient={selectedDetails}
      />
    </div>
  );
}
