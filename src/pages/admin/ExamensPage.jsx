// src/pages/admin/ExamensPage.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { useAuth } from "../../auth/AuthContext";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import { getUsers } from "../../api/users";
import {
  getExamens,
  createExamen,
  updateExamen,
  deleteExamen,
  updateResultat,
  interpretExamen,
} from "../../api/examens";
import ExamenModal from "../../components/examens/ExamenModal";
import ResultatModal from "../../components/examens/ResultatModal";
import ExamenDetailsModal from "../../components/examens/ExamenDetailsModal";

export default function ExamensPage() {
  const { token, user } = useAuth();

  // états
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // pagination / filtres
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [statut, setStatut] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [medecinFilter, setMedecinFilter] = useState("");
  const [medecins, setMedecins] = useState([]);

  // modales & édition
  const [openExamenModal, setOpenExamenModal] = useState(false);
  const [examenToEdit, setExamenToEdit] = useState(null);
  const [openResultModal, setOpenResultModal] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selected, setSelected] = useState(null);
  const [detailsItem, setDetailsItem] = useState(null);

  // Charger les médecins
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const users = await getUsers(token);
        setMedecins(
          (users || []).filter((u) => (u.role || "").toLowerCase() === "medecin")
        );
      } catch (err) {
        console.error("Erreur chargement médecins:", err);
      }
    })();
  }, [token]);

  // Normalisation du statut
  const normalizeStatut = (s) => {
    if (!s) return "-";
    try {
      const clean = String(s)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      if (clean.toLowerCase().startsWith("valid")) return "valide";
      if (
        clean.toLowerCase().includes("encours") ||
        clean.toLowerCase().includes("en_cours")
      )
        return "en_cours";
      if (clean.toLowerCase().startsWith("prescrit")) return "prescrit";
      return clean.toLowerCase();
    } catch {
      return s;
    }
  };

  // Chargement examens
  const loadExamens = useCallback(
    async (opts = {}) => {
      if (!token) return;
      setLoading(true);
      try {
        const response = await getExamens(token, {
          page: opts.page ?? page,
          limit: opts.limit ?? limit,
          statut: opts.statut ?? statut,
        });

        if (response?.error) {
          toast.error(response.error || "Impossible de charger les examens ❌");
          setRows([]);
          return;
        }

        const examens = Array.isArray(response)
          ? response
          : Array.isArray(response.rows)
          ? response.rows
          : Array.isArray(response.data)
          ? response.data
          : [];

        setRows(examens);
      } catch (err) {
        console.error("Erreur chargement examens:", err);
        toast.error("Erreur inattendue lors du chargement des examens ❌");
        setRows([]);
      } finally {
        setLoading(false);
      }
    },
    [token, page, limit, statut]
  );

  useEffect(() => {
    loadExamens();
  }, [loadExamens]);

  const columns = useMemo(
    () => [
      "#",
      "Consultation",
      "Type examen",
      "Médecin",
      "Laborantin",
      "Date prescription",
      "Statut",
      "Actions",
    ],
    []
  );

  // Filtrage local
  const filteredRows = rows.filter((e) => {
    const searchLower = (search || "").toLowerCase();
    const matchesSearch =
      !searchLower ||
      (e.type_examen || "").toLowerCase().includes(searchLower) ||
      (e.consultation?.patient?.nom || "").toLowerCase().includes(searchLower) ||
      (e.consultation?.patient?.prenom || "")
        .toLowerCase()
        .includes(searchLower);
    const matchesType = typeFilter ? e.type_examen === typeFilter : true;
    const matchesMedecin = medecinFilter
      ? e.medecin_id === Number(medecinFilter)
      : true;
    const matchesStatut = statut
      ? normalizeStatut(e.statut) === statut
      : true;
    return matchesSearch && matchesType && matchesMedecin && matchesStatut;
  });

  const handleModalSave = async (payload) => {
    setSaving(true);
    try {
      if (examenToEdit && examenToEdit.id) {
        await updateExamen(token, examenToEdit.id, payload);
        toast.success("✅ Examen mis à jour");
      } else {
        await createExamen(token, payload);
        toast.success("✅ Examen prescrit");
      }
      setOpenExamenModal(false);
      setExamenToEdit(null);
      await loadExamens({ page: 1 });
      setPage(1);
    } catch (err) {
      console.error("Erreur création/modification examen:", err?.response?.data || err);
      toast.error(err?.response?.data?.error || "❌ Échec opération examen");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Voulez-vous vraiment supprimer cet examen ?"))
      return;
    setSaving(true);
    try {
      await deleteExamen(token, id);
      toast.success("🗑️ Examen supprimé");
      await loadExamens();
    } catch (err) {
      console.error("Erreur suppression examen:", err?.response?.data || err);
      toast.error(err?.response?.data?.error || "❌ Échec suppression");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveResult = async (payload) => {
    if (!selected?.id) {
      toast.error("⚠️ Aucun examen sélectionné.");
      return;
    }
    setSaving(true);
    try {
      await updateResultat(token, selected.id, payload);
      toast.success("✅ Résultats enregistrés");
      setOpenResultModal(false);
      setSelected(null);
      await loadExamens();
    } catch (err) {
      console.error("Erreur maj résultat:", err?.response?.data || err);
      toast.error(
        err?.response?.data?.error || "❌ Échec enregistrement résultats"
      );
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleInterpret = async (id) => {
    setSaving(true);
    try {
      await interpretExamen(token, id);
      toast.success("✅ Examen interprété");
      await loadExamens();
    } catch (err) {
      console.error("Erreur interprétation:", err?.response?.data || err);
      toast.error(err?.response?.data?.error || "❌ Impossible d'interpréter");
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = (exam) => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(14);
      doc.text("🧪 Résultat d'examen", 10, 15);
      doc.setFontSize(11);
      doc.text(
        `Patient: ${exam.consultation?.patient
          ? [exam.consultation.patient.nom, exam.consultation.patient.postnom, exam.consultation.patient.prenom].filter(Boolean).join(" ")
          : `Patient #${exam.consultation?.patient_id || "-"}`}`,
        10,
        30
      );
      doc.text(`Médecin: ${exam.medecin?.noms || "-"}`, 10, 40);
      doc.text(`Laborantin: ${exam.laborantin?.noms || "-"}`, 10, 50);
      doc.text(`Type: ${exam.type_examen || "-"}`, 10, 60);
      doc.text(`Date: ${exam.date_prescription || "-"}`, 10, 70);
      doc.text(`Statut: ${normalizeStatut(exam.statut)}`, 10, 80);

      if (exam.resultats?.length > 0) {
        doc.text("Résultats :", 10, 95);
        exam.resultats.forEach((r, i) => {
          doc.text(
            `${r.parametre}: ${r.valeur} ${r.unite || ""} (${r.interpretation || "-"})`,
            10,
            105 + i * 8,
            { maxWidth: 180 }
          );
        });
      }
      doc.save(`examen-${exam.id}.pdf`);
    } catch (err) {
      console.error("Erreur génération PDF client:", err);
      toast.error("Impossible de générer le PDF.");
    }
  };

  const formatDate = (d) => {
    if (!d) return "-";
    try {
      return new Date(d).toLocaleDateString("fr-FR", {
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

  const getStatutClass = (s) => {
    switch (normalizeStatut(s)) {
      case "prescrit":
        return "bg-yellow-100 text-yellow-700";
      case "en_cours":
        return "bg-blue-100 text-blue-700";
      case "valide":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6">
      {/* Header + filtres */}
      <div className="flex flex-wrap justify-between mb-4 gap-2">
        <h1 className="text-xl font-semibold">Examens</h1>
        <div className="flex flex-wrap gap-2 items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Rechercher (patient / type)"
            className="border rounded px-3 py-2"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">Tous types</option>
            {[...new Set(rows.map((r) => r.type_examen))].map(
              (t) =>
                t && (
                  <option key={t} value={t}>
                    {t}
                  </option>
                )
            )}
          </select>
          <select
            value={medecinFilter}
            onChange={(e) => setMedecinFilter(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">Tous médecins</option>
            {medecins.map((m) => (
              <option key={m.id} value={m.id}>
                {m.noms}
              </option>
            ))}
          </select>
          <select
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">Tous statuts</option>
            <option value="prescrit">Prescrit</option>
            <option value="en_cours">En cours</option>
            <option value="valide">Validé</option>
          </select>

          {(user?.role === "medecin" || user?.role === "admin") && (
            <button
              disabled={saving}
              onClick={() => {
                setExamenToEdit(null);
                setOpenExamenModal(true);
              }}
              className={`px-3 py-2 rounded text-white ${
                saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {saving ? "..." : "+ Prescrire"}
            </button>
          )}
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded shadow">
        <div className="px-4 py-2 text-sm text-gray-600">
          {loading
            ? "Chargement..."
            : `Total ${filteredRows.length} examen${
                filteredRows.length > 1 ? "s" : ""
              }`}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((c) => (
                  <th key={c} className="px-4 py-2 text-left">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((e, idx) => (
                <tr key={e.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{(page - 1) * limit + idx + 1}</td>
                  <td className="px-4 py-2">
                    {e.consultation ? (
                      <>
                        <div className="font-medium">#{e.consultation.id}</div>
                        <div>
                          👤{" "}
                          {e.consultation.patient
                            ? [
                                e.consultation.patient.nom,
                                e.consultation.patient.postnom,
                                e.consultation.patient.prenom,
                              ]
                                .filter(Boolean)
                                .join(" ")
                            : `Patient #${e.consultation.patient_id || "-"}`}
                        </div>
                        <div>
                          📅{" "}
                          {e.consultation.date_consultation
                            ? formatDate(e.consultation.date_consultation)
                            : "-"}
                        </div>
                        <div>
                          📝 Motif: {e.consultation.motif || "-"}
                        </div>
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-2">{e.type_examen || "-"}</td>
                  <td className="px-4 py-2">
                    {e.medecin
                      ? e.medecin.noms
                      : e.medecin_id
                      ? `Médecin #${e.medecin_id}`
                      : "-"}
                  </td>
                  <td className="px-4 py-2">
                    {e.laborantin
                      ? e.laborantin.noms
                      : e.laborantin_id
                      ? `Laborantin #${e.laborantin_id}`
                      : "-"}
                  </td>
                  <td className="px-4 py-2">
                    {formatDate(e.date_prescription)}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${getStatutClass(
                        e.statut
                      )}`}
                    >
                      {normalizeStatut(e.statut)}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => {
                        setDetailsItem(e);
                        setOpenDetails(true);
                      }}
                      className="px-2 py-1 rounded border hover:bg-gray-100"
                      title="Voir détails"
                    >
                      👁️
                    </button>
                    {(user?.role === "medecin" || user?.role === "admin") && (
                      <button
                        onClick={() => {
                          setExamenToEdit(e);
                          setOpenExamenModal(true);
                        }}
                        disabled={saving}
                        className="px-2 py-1 rounded border hover:bg-yellow-100"
                        title="Modifier la prescription"
                      >
                        ✏️
                      </button>
                    )}
                    {(user?.role === "laborantin" || user?.role === "admin") && (
                      <button
                        onClick={() => {
                          setSelected(e);
                          setOpenResultModal(true);
                        }}
                        className="px-2 py-1 rounded border hover:bg-gray-100"
                        title="Saisir/Modifier résultats"
                      >
                        🧪
                      </button>
                    )}
                    {user?.role === "medecin" &&
                      normalizeStatut(e.statut) === "en_cours" && (
                        <button
                          onClick={() => handleInterpret(e.id)}
                          className="px-2 py-1 rounded border hover:bg-green-100"
                          title="Interpréter"
                        >
                          ✅
                        </button>
                      )}
                    {(user?.role === "admin" || user?.role === "medecin") && (
                      <button
                        disabled={saving}
                        onClick={() => handleDelete(e.id)}
                        className="px-2 py-1 rounded border hover:bg-red-100"
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    )}
                    <button
                      onClick={() => handleDownloadPDF(e)}
                      className="px-2 py-1 rounded border hover:bg-gray-100"
                      title="Télécharger PDF"
                    >
                      📄
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && filteredRows.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-6 text-gray-500"
                  >
                    Aucun examen trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales */}
      <ExamenModal
        open={openExamenModal}
        onClose={() => {
          setOpenExamenModal(false);
          setExamenToEdit(null);
        }}
        onSave={handleModalSave}
        examen={examenToEdit}
      />
      <ResultatModal
        open={openResultModal}
        onClose={() => {
          setOpenResultModal(false);
          setSelected(null);
        }}
        onSave={handleSaveResult}
        examen={selected}
      />
      <ExamenDetailsModal
        open={openDetails}
        onClose={() => {
          setOpenDetails(false);
          setDetailsItem(null);
        }}
        examen={detailsItem}
      />
    </div>
  );
}
