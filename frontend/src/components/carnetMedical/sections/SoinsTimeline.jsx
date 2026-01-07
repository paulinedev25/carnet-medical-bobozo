import React from "react";
import { Chrono } from "react-chrono";

export default function SoinsTimeline({ events = [] }) {
  // Si aucun soin infirmier, on affiche un message
  if (!Array.isArray(events) || events.length === 0) {
    return (
      <div className="text-center text-gray-500 py-6">
        Aucun soin infirmier enregistré.
      </div>
    );
  }

  // Préparer les items pour React Chrono
  const items = events
    .sort((a, b) => new Date(b.date_soin) - new Date(a.date_soin))
    .map((soin) => ({
      title: new Date(soin.date_soin).toLocaleDateString("fr-FR"),
      cardTitle: soin.type_soin || "Soin infirmier",
      cardSubtitle: `Infirmier : ${soin.infirmier?.noms || "-"}`,
      cardDetailedText: `
          🗓️ ${new Date(soin.date_soin).toLocaleTimeString("fr-FR")}
          💬 Observations : ${soin.observations || "-"}
          ${soin.remarque_medecin ? `\n📝 Remarque médecin : ${soin.remarque_medecin}` : ""}
      `,
    }));

  return (
    <div style={{ width: "100%", height: "500px" }}>
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
  );
}
