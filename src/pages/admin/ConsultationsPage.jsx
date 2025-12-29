import { useMemo, useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useConsultations } from "../../hooks/useConsultations";
import ConsultationModal from "../../components/consultations/ConsultationModal";
import ConsultationDetailsModal from "../../components/consultations/ConsultationDetailsModal";
import { toast } from "react-toastify";
import { getUsers } from "../../api/users";
import { jsPDF } from "jspdf";
import logoHopital from "../../images/logo-hopital.jpg";

export default function ConsultationsPage() {
  const { token, utilisateur } = useAuth();
  const role = utilisateur?.role?.toLowerCase();
  const isReceptionniste = role === "receptionniste";

  const {
    rows, count, page, limit, statut, loading,
    canCreate, canEdit, canChangeStatut,
    setPage, setLimit, setStatut,
    add, edit, changeStatut, reload,
  } = useConsultations();

  const [openModal, setOpenModal] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selected, setSelected] = useState(null);

  const [search, setSearch] = useState("");
  const [medecins, setMedecins] = useState([]);
  const [medecinFilter, setMedecinFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const users = await getUsers(token);
        setMedecins((users || []).filter((u) => (u.role || "").toLowerCase() === "medecin"));
      } catch (err) {
        console.error("Erreur chargement médecins", err);
      }
    })();
  }, [token]);

  const totalPages = Math.max(1, Math.ceil(count / limit));

  const columns = useMemo(
    () => ["#", "Patient", "Médecin", "Motif", "Tension", "Température", "Poids", "Date", "Statut", "Actions"],
    []
  );

  const filteredRows = rows.filter((c) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      c.motif?.toLowerCase().includes(searchLower) ||
      c.patient?.nom?.toLowerCase().includes(searchLower) ||
      c.patient?.prenom?.toLowerCase().includes(searchLower);

    const matchesMedecin = medecinFilter ? c.medecin_id === Number(medecinFilter) : true;
    const matchesDate = dateFilter ? (c.date_consultation || "").slice(0, 10) === dateFilter : true;

    return matchesSearch && matchesMedecin && matchesDate;
  });

  const onAdd = async (payload) => {
    try {
      await add(payload);
      toast.success("✅ Consultation enregistrée");
      setOpenModal(false);
    } catch (err) {
      console.error("Erreur ajout consultation:", err);
      toast.error("❌ Échec de l'enregistrement");
    }
  };

  const onEdit = async (payload) => {
    try {
      if (!selected) return;
      await edit(selected.id, payload);
      toast.success("✅ Consultation mise à jour");
      setSelected(null);
      setOpenModal(false);
    } catch (err) {
      console.error("Erreur édition consultation:", err);
      toast.error("❌ Échec de la mise à jour");
    }
  };

  const onChangeStatut = async (c, newStatut) => {
    try {
      await changeStatut(c.id, newStatut);
      toast.info(`Statut changé en ${newStatut}`);
      await reload();
    } catch (err) {
      console.error("Erreur changement statut:", err);
      toast.error("❌ Impossible de changer le statut");
    }
  };

  const handlePrint = (consultation) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head><title>Détails Consultation</title></head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <div style="text-align:center; margin-bottom: 20px;">
            <img src="${logoHopital}" style="height:80px; object-fit:contain;" />
          </div>
          <h2 style="text-align:center;">📝 Consultation</h2>
          <p><strong>Patient:</strong> ${consultation.patient ? `${consultation.patient.nom} ${consultation.patient.prenom || ""}` : "-"}</p>
          <p><strong>Médecin:</strong> ${consultation.medecin?.noms || "-"}</p>
          <p><strong>Date:</strong> ${consultation.date_consultation ? new Date(consultation.date_consultation).toLocaleString("fr-FR") : "-"}</p>
          <p><strong>Motif:</strong> ${consultation.motif || "-"}</p>
          <hr />
          <p><strong>Tension:</strong> ${consultation.tension_arterielle || "-"}</p>
          <p><strong>Température:</strong> ${consultation.temperature || "-"}</p>
          <p><strong>Poids:</strong> ${consultation.poids || "-"}</p>
          <p><strong>Pouls:</strong> ${consultation.pouls || "-"}</p>
          <p><strong>Observations:</strong> ${consultation.observations_initiales || "-"}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownloadPDF = (consultation) => {
    const doc = new jsPDF();
    doc.addImage(logoHopital, "JPEG", 80, 5, 50, 25);
    doc.setFontSize(14);
    doc.text("📝 Rapport de Consultation", 10, 45);
    doc.setFontSize(11);
    doc.text(`Patient: ${consultation.patient ? `${consultation.patient.nom} ${consultation.patient.prenom || ""}` : "-"}`, 10, 60);
    doc.text(`Médecin: ${consultation.medecin?.noms || "-"}`, 10, 70);
    doc.text(`Date: ${consultation.date_consultation ? new Date(consultation.date_consultation).toLocaleString("fr-FR") : "-"}`, 10, 80);
    doc.text(`Motif: ${consultation.motif || "-"}`, 10, 90);
    doc.text(`Tension: ${consultation.tension_arterielle || "-"}`, 10, 105);
    doc.text(`Température: ${consultation.temperature || "-"}`, 10, 115);
    doc.text(`Poids: ${consultation.poids || "-"}`, 10, 125);
    doc.text(`Pouls: ${consultation.pouls || "-"}`, 10, 135);
    doc.text(`Observations: ${consultation.observations_initiales || "-"}`, 10, 150, { maxWidth: 180 });
    doc.save(`consultation-${consultation.id}.pdf`);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatutBadgeClass = (s) => {
    switch (s) {
      case "ouverte": return "bg-green-100 text-green-700";
      case "en_cours": return "bg-yellow-100 text-yellow-700";
      case "cloturee": return "bg-gray-300 text-gray-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-6">
      {/* Header + filtres */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
        <h1 className="text-xl font-semibold">Consultations</h1>

        <div className="flex flex-wrap gap-2 items-center">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 Rechercher (nom / motif)" className="border rounded px-3 py-2" />
          <select value={medecinFilter} onChange={(e) => setMedecinFilter(e.target.value)} className="border rounded px-3 py-2">
            <option value="">Tous médecins</option>
            {medecins.map((m) => <option key={m.id} value={m.id}>{m.noms}</option>)}
          </select>
          <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="border rounded px-3 py-2" />
          <select value={statut} onChange={(e) => setStatut(e.target.value)} className="border rounded px-3 py-2" disabled={loading}>
            <option value="">Tous statuts</option>
            <option value="ouverte">Ouverte</option>
            <option value="en_cours">En cours</option>
            <option value="cloturee">Clôturée</option>
          </select>
          <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="border rounded px-3 py-2" disabled={loading}>
            {[10, 20, 50].map((n) => <option key={n} value={n}>{n}/page</option>)}
          </select>
          {canCreate && (
            <button onClick={() => { setSelected(null); setOpenModal(true); }} className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50" disabled={loading}>
              + Nouvelle
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow">
        <div className="px-4 py-2 text-sm text-gray-600">
          {loading ? "Chargement..." : `Total ${filteredRows.length} consultation${filteredRows.length > 1 ? "s" : ""}`}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((c) => <th key={c} className="text-left px-4 py-2 font-medium">{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((c, idx) => (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{(page - 1) * limit + idx + 1}</td>
                  <td className="px-4 py-2">{c.patient ? [c.patient.nom, c.patient.postnom, c.patient.prenom].filter(Boolean).join(" ") : "-"}</td>
                  <td className="px-4 py-2">{c.medecin?.noms || "-"}</td>
                  <td className="px-4 py-2">{c.motif || "-"}</td>
                  <td className="px-4 py-2">{c.tension_arterielle || "-"}</td>
                  <td className="px-4 py-2">{c.temperature || "-"}</td>
                  <td className="px-4 py-2">{c.poids || "-"}</td>
                  <td className="px-4 py-2">{formatDate(c.date_consultation)}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatutBadgeClass(c.statut)}`}>
                      {c.statut}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button className="px-2 py-1 rounded border hover:bg-gray-100" onClick={() => { setSelected(c); setOpenDetails(true); }}>👁️</button>
                    <button className="px-2 py-1 rounded border hover:bg-gray-100" onClick={() => handlePrint(c)}>🖨️</button>
                    <button className="px-2 py-1 rounded border hover:bg-gray-100" onClick={() => handleDownloadPDF(c)}>📄</button>
                    
                    {/* Bouton ✏️ : toujours pour réceptionniste, conditionné pour les autres */}
                    {isReceptionniste ? (
                      <button className="px-2 py-1 rounded border hover:bg-gray-100" onClick={() => { setSelected(c); setOpenModal(true); }}>✏️</button>
                    ) : (
                      canEdit && (
                        <button className="px-2 py-1 rounded border hover:bg-gray-100" onClick={() => { setSelected(c); setOpenModal(true); }}>✏️</button>
                      )
                    )}

                    {canChangeStatut && (
                      <select value={c.statut} onChange={(e) => onChangeStatut(c, e.target.value)} className="border rounded px-2 py-1">
                        <option value="ouverte">Ouverte</option>
                        <option value="en_cours">En cours</option>
                        <option value="cloturee">Clôturée</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && filteredRows.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-500">
                    Aucune consultation trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales */}
      <ConsultationModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSave={selected ? onEdit : onAdd}
        consultation={selected}
        token={token}
      />

      <ConsultationDetailsModal
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        consultation={selected}
      />
    </div>
  );
}