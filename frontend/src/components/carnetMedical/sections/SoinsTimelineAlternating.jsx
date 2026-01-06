import React from "react";
import { Chrono } from "react-chrono";

// Transforme tes données en items utilisables par react-chrono
function buildChronoItems(events) {
  return events
    .sort((a, b) => new Date(b.date_soin) - new Date(a.date_soin))
    .map((soin) => ({
      title: new Date(soin.date_soin).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      cardTitle: soin.type_soin,
      cardSubtitle: `Infirmier : ${soin.infirmier?.noms || "-"}`,
      cardDetailedText: `
        Observations : ${soin.observations || "-"}
        ${soin.remarque_medecin ? "\nRemarque médecin : " + soin.remarque_medecin : ""}
      `,
    }));
}

export default function SoinsTimelineAlternating({ events = [] }) {
  const items = buildChronoItems(events);

  if (!items.length) {
    return (
      <div className="text-center text-gray-500 py-6">
        Aucun soin infirmier enregistré.
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "auto", minHeight: "500px" }}>
      <Chrono
        items={items}
        mode="vertical-alternating"
        slideShow={false}
        cardHeight={120}
        theme={{
          primary: "#2563EB",       // bleu principal
          secondary: "#FFFFFF",     // fond blanc cards
          cardBgColor: "#F9FAFB",   // fond léger
          cardForeColor: "#1F2937", // texte sombre
        }}
      />
    </div>
  );
}
