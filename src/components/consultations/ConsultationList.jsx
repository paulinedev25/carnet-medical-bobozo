// src/components/consultations/ConsultationList.jsx
import { useEffect, useState } from "react";
import {
  getConsultations,
  getConsultationsStats,
  deleteConsultation,
  updateConsultationStatut,
} from "../../api/consultations";
import ConsultationModal from "./ConsultationModal";
import ConsultationDetailsModal from "./ConsultationDetailsModal";
import { toast } from "react-toastify";
import { useAuth } from "../../auth/AuthContext";

export default function ConsultationList({ token }) {
  const { user } = useAuth();

  const [consultations, setConsultations] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    statut: "",
    motif: "",
    fromDate: "",
    toDate: "",
  });

  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // ✅ Helpers
  const isMedecin = (user) => {
    if (!user) return false;
    const role = user.role?.toLowerCase();
    const fonction = user.fonction?.toLowerCase() || "";
    return role === "medecin" || (role === "admin" && fonction.includes("médecin"));
  };

  const isAdminNonMedecin = (user) => {
    if (!user) return false;
    const role = user.role?.toLowerCase();
    const fonction = user.fonction?.toLowerCase() || "";
    return role === "admin" && !fonction.includes("médecin");
  };

  // Charger stats
  const fetchStats = async () => {
    try {
      const data = await getConsultationsStats(token);
      setStats(data);
    } catch {
      toast.error("❌ Impossible de charger les statistiques");
    }
  };

  // Charger consultations
  const fetchConsultations = async () => {
    setLoading(true);
    try {
      const res = await getConsultations(token, {
        page,
        limit,
        ...filters,
      });
      setConsultations(res.rows || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("Erreur fetchConsultations:", err);
      toast.error("❌ Impossible de charger les consultations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [token]);

  useEffect(() => {
    fetchConsultations();
  }, [token, page, filters]);

  // Gérer suppression
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette consultation ?")) return;
    try {
      await deleteConsultation(token, id);
      toast.success("Consultation supprimée ✅");
      fetchConsultations();
      fetchStats();
    } catch {
      toast.error("❌ Échec suppression consultation");
    }
  };

  // Gérer changement statut
  const handleChangeStatut = async (c) => {
    try {
      let newStatut =
        c.statut === "ouverte" ? "en_cours" : c.statut === "en_cours" ? "cloturee" : "ouverte";

      // 🩺 Cas médecin / admin médecin
      if (isMedecin(user)) {
        if (c.statut === "cloturee") {
          toast.error("❌ Cette consultation est clôturée, seul un admin peut corriger");
          return;
        }
        if (user.id !== c.medecin_id) {
          toast.error("❌ Vous n’êtes pas le médecin responsable de cette consultation");
          return;
        }
      }

      // 🛑 Cas admin non médecin → peut corriger même cloturée
      if (isAdminNonMedecin(user)) {
        newStatut = prompt(
          "Changer le statut (ouverte, en_cours, cloturee) :",
          c.statut
        )?.toLowerCase();
        if (!["ouverte", "en_cours", "cloturee"].includes(newStatut)) {
          toast.error("❌ Statut invalide");
          return;
        }
      }

      await updateConsultationStatut(token, c.id, newStatut);
      toast.success("Statut mis à jour ✅");
      fetchConsultations();
      fetchStats();
    } catch {
      toast.error("❌ Impossible de mettre à jour le statut");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 📊 Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-green-100 rounded text-center">
          <p className="text-xl font-bold">{stats.ouvertes || 0}</p>
          <p>Ouvertes</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded text-center">
          <p className="text-xl font-bold">{stats.en_cours || 0}</p>
          <p>En cours</p>
        </div>
        <div className="p-4 bg-gray-200 rounded text-center">
          <p className="text-xl font-bold">{stats.cloturees || 0}</p>
          <p>Clôturées</p>
        </div>
      </div>

      {/* 🔍 Filtres */}
      <div className="bg-white shadow p-4 rounded grid grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Rechercher par motif..."
          value={filters.motif}
          onChange={(e) => setFilters({ ...filters, motif: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <select
          value={filters.statut}
          onChange={(e) => setFilters({ ...filters, statut: e.target.value })}
          className="border rounded px-3 py-2"
        >
          <option value="">-- Statut --</option>
          <option value="ouverte">Ouverte</option>
          <option value="en_cours">En cours</option>
          <option value="cloturee">Clôturée</option>
        </select>
        <input
          type="date"
          value={filters.fromDate}
          onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
          className="border rounded px-3 py-2"
        />
        <input
          type="date"
          value={filters.toDate}
          onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
          className="border rounded px-3 py-2"
        />
      </div>

      {/* 📋 Tableau */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Patient</th>
              <th className="p-2 border">Médecin</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Motif</th>
              <th className="p-2 border">Statut</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  Chargement...
                </td>
              </tr>
            ) : consultations.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  Aucune consultation trouvée
                </td>
              </tr>
            ) : (
              consultations.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="p-2 border">
                    {c.patient
                      ? `${c.patient.nom} ${c.patient.postnom || ""} ${c.patient.prenom || ""}`
                      : "-"}
                  </td>
                  <td className="p-2 border">{c.medecin?.noms || "-"}</td>
                  <td className="p-2 border">
                    {c.date ? new Date(c.date).toLocaleDateString("fr-FR") : "-"}
                  </td>
                  <td className="p-2 border">{c.motif || "-"}</td>
                  <td className="p-2 border">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        c.statut === "ouverte"
                          ? "bg-green-100 text-green-700"
                          : c.statut === "en_cours"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {c.statut}
                    </span>
                  </td>
                  <td className="p-2 border space-x-2">
                    <button
                      onClick={() => {
                        setSelected(c);
                        setDetailsOpen(true);
                      }}
                      className="px-2 py-1 bg-blue-100 rounded hover:bg-blue-200"
                    >
                      Voir
                    </button>
                    {c.statut !== "cloturee" && (
                      <button
                        onClick={() => {
                          setSelected(c);
                          setModalOpen(true);
                        }}
                        className="px-2 py-1 bg-yellow-100 rounded hover:bg-yellow-200"
                      >
                        Modifier
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="px-2 py-1 bg-red-100 rounded hover:bg-red-200"
                    >
                      Supprimer
                    </button>
                    {(c.statut !== "cloturee" && isMedecin(user)) ||
                    isAdminNonMedecin(user) ? (
                      <button
                        onClick={() => handleChangeStatut(c)}
                        className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                      >
                        Suivant ➡️
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          ⬅️ Précédent
        </button>
        <span>
          Page {page} / {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Suivant ➡️
        </button>
      </div>

      {/* 📝 Modals */}
      <ConsultationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={() => {
          fetchConsultations();
          fetchStats();
          setModalOpen(false);
        }}
        consultation={selected}
        token={token}
      />

      <ConsultationDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        consultation={selected}
      />
    </div>
  );
}
