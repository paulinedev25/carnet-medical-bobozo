import React, { useState, useMemo } from "react";
import { Chrono } from "react-chrono";

import SoinsDetailModal from "./SoinsDetailModal";
import SoinsFilters from "./SoinsFilters";

export default function SoinsTimelineAdvanced({ events = [] }) {
  const [filters, setFilters] = useState({});
  const [selectedSoin, setSelectedSoin] = useState(null);

  // Extrait la liste des infirmiers disponibles
  const infirmiers = useMemo(() => {
    const map = {};
    events.forEach((s) => {
      if (s.infirmier) map[s.infirmier.id] = s.infirmier;
    });
    return Object.values(map);
  }, [events]);

  // Applique les filtres
  const filteredEvents = useMemo(() => {
    return events.filter((s) => {
      if (filters.statut && s.statut_validation !== filters.statut) {
        return false;
      }
      if (filters.infirmier && String(s.infirmier?.id) !== filters.infirmier) {
        return false;
      }
      if (filters.dateDebut && new Date(s.date_soin) < new Date(filters.dateDebut)) {
        return false;
      }
      if (filters.dateFin && new Date(s.date_soin) > new Date(filters.dateFin)) {
        return false;
      }
      return true;
    });
  }, [events, filters]);

  const items = filteredEvents
    .sort((a, b) => new Date(b.date_soin) - new Date(a.date_soin))
    .map((soin) => ({
      title: new Date(soin.date_soin).toLocaleDateString("fr-FR"),
      cardTitle: soin.type_soin,
      cardSubtitle: soin.infirmier?.noms,
      onClick: () => setSelectedSoin(soin),
    }));

  return (
    <>
      {/* Filtres */}
      <SoinsFilters onFilterChange={setFilters} infirmiers={infirmiers} defaultFilters={filters} />

      {/* Timeline */}
      <div className="w-full h-[500px]">
        <Chrono
          items={items}
          mode="vertical-alternating"
          theme={{
            primary: "#2563EB",
            secondary: "#FFFFFF",
            cardBgColor: "#F9FAFB",
            cardForeColor: "#1F2937",
          }}
        />
      </div>

      {/* Détail du soin */}
      {selectedSoin && (
        <SoinsDetailModal
          soin={selectedSoin}
          onClose={() => setSelectedSoin(null)}
          onEdit={(soin) => console.log("edit", soin)}
          onDelete={(soin) => console.log("delete", soin)}
        />
      )}
    </>
  );
}
