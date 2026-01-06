import React, { useState, useMemo } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function SoinsInfirmiersSection({ data = [], patientId }) {
  const [search, setSearch] = useState("");
  const [statutFilter, setStatutFilter] = useState("");
  const [infirmierFilter, setInfirmierFilter] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  // 📌 Filtrer les soins
  const filteredSoins = useMemo(() => {
    return data.filter((s) => {
      const sujet = s.type_soin?.toLowerCase() || "";
      const matchesSearch = search ? sujet.includes(search.toLowerCase()) : true;
      const matchesStatut = statutFilter ? s.statut_validation === statutFilter : true;
      const matchesInfirmier = infirmierFilter
        ? s.infirmier?.noms?.toLowerCase()?.includes(infirmierFilter.toLowerCase())
        : true;
      const dateS = s.date_soin ? new Date(s.date_soin) : null;
      const matchesDate =
        (!dateStart || (dateS && dateS >= new Date(dateStart))) &&
        (!dateEnd || (dateS && dateS <= new Date(dateEnd)));
      return matchesSearch && matchesStatut && matchesInfirmier && matchesDate;
    });
  }, [data, search, statutFilter, infirmierFilter, dateStart, dateEnd]);

  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const labelStatut = (s) => {
    switch (s) {
      case "en_attente":
        return "En attente";
      case "valide":
        return "Validé";
      case "rejete":
        return "Rejeté";
      default:
        return s;
    }
  };

  // 📄 Export PDF 👍
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Soins infirmiers - Patient #" + patientId, 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [["Type", "Infirmier", "Médecin", "Date", "Statut"]],
      body: filteredSoins.map((s) => [
        s.type_soin,
        s.infirmier?.noms || "-",
        s.medecin?.noms || "-",
        formatDate(s.date_soin),
        labelStatut(s.statut_validation),
      ]),
    });
    doc.save(`soins-infirmiers-patient-${patientId}.pdf`);
  };

  const handleTimeline = () => {
    // 📌 TODO: générer timeline (UI ou PDF), selon besoins UX
    window.alert("La fonctionnalité Timeline sera implémentée bientôt");
  };

  return (
    <div className="space-y-4">
      {/* 🔎 Filtres */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="🔍 Rechercher par type soin"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2"
        />

        <select
          value={statutFilter}
          onChange={(e) => setStatutFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Tous statuts</option>
          <option value="en_attente">En attente</option>
          <option value="valide">Validé</option>
          <option value="rejete">Rejeté</option>
        </select>

        <input
          type="text"
          placeholder="Filtrer infirmier"
          value={infirmierFilter}
          onChange={(e) => setInfirmierFilter(e.target.value)}
          className="border rounded px-3 py-2"
        />

        <input
          type="date"
          value={dateStart}
          onChange={(e) => setDateStart(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <input
          type="date"
          value={dateEnd}
          onChange={(e) => setDateEnd(e.target.value)}
          className="border rounded px-3 py-2"
        />

        <button
          onClick={exportPDF}
          className="bg-green-600 text-white px-3 py-2 rounded"
        >
          📄 Exporter PDF
        </button>

        <button
          onClick={handleTimeline}
          className="bg-blue-600 text-white px-3 py-2 rounded"
        >
          📊 Voir Timeline
        </button>
      </div>

      {/* 📋 Liste des soins */}
      {filteredSoins.length === 0 ? (
        <div className="text-center text-gray-500 py-6">
          Aucun soin infirmier enregistré.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSoins.map((soin) => (
            <div
              key={soin.id}
              className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {soin.type_soin || "—"}
                </h3>
                <span className="text-sm font-semibold text-blue-700">
                  {labelStatut(soin.statut_validation)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-700 mb-2">
                <div><strong>Date :</strong> {formatDate(soin.date_soin)}</div>
                <div><strong>Infirmier :</strong> {soin.infirmier?.noms || "-"}</div>
                <div><strong>Médecin :</strong> {soin.medecin?.noms || "-"}</div>
              </div>

              <div className="text-sm text-gray-800 mb-2">
                <strong>Observations :</strong> {soin.observations || "-"}
              </div>

              {/* 🔧 Boutons d’action */}
              <div className="flex gap-2 text-sm">
                <button className="px-2 py-1 border rounded hover:bg-gray-100">
                  ✏️ Modifier
                </button>
                <button className="px-2 py-1 border text-red-600 rounded hover:bg-gray-100">
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
