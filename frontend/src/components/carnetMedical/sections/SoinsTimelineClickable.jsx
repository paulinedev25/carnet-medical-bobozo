import React, { useState } from "react";
import { Chrono } from "react-chrono";
import SoinsDetailModal from "./SoinsDetailModal";

export default function SoinsTimelineClickable({ events = [] }) {
  const [selectedSoin, setSelectedSoin] = useState(null);

  if (!Array.isArray(events) || events.length === 0) {
    return (
      <div className="text-center text-gray-500 py-6">
        Aucun soin infirmier enregistré.
      </div>
    );
  }

  const items = events
    .sort((a, b) => new Date(b.date_soin) - new Date(a.date_soin))
    .map((soin) => ({
      title: new Date(soin.date_soin).toLocaleDateString("fr-FR"),
      cardTitle: soin.type_soin,
      cardSubtitle: soin.infirmier?.noms || "-",
      onClick: () => setSelectedSoin(soin),
    }));

  return (
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

      {/* Modal de détail du soin */}
      {selectedSoin && (
        <SoinsDetailModal
          soin={selectedSoin}
          onClose={() => setSelectedSoin(null)}
        />
      )}
    </div>
  );
}
