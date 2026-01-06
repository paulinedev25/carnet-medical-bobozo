import React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function SoinsTimeline({ events = [] }) {
  if (!Array.isArray(events) || events.length === 0) {
    return (
      <div className="text-center text-gray-500 py-6">
        Aucun soin infirmier enregistré.
      </div>
    );
  }

  // Trier du plus récent au plus ancien
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.date_soin) - new Date(a.date_soin)
  );

  return (
    <div className="relative border-l border-gray-300 ml-4">
      {sortedEvents.map((soin, index) => (
        <div key={soin.id} className="mb-8 ml-6 flex flex-col">
          {/* Point sur la timeline */}
          <span className="absolute -left-3.5 mt-1 w-3 h-3 rounded-full bg-blue-500"></span>

          <div className="bg-white shadow-sm rounded p-4 border">
            <div className="flex justify-between items-center mb-1">
              <span className="text-lg font-semibold text-gray-800">
                {soin.type_soin || "Soin infirmier"}
              </span>
              <span className="text-sm text-gray-500">
                {format(new Date(soin.date_soin), "dd MMM yyyy HH:mm", { locale: fr })}
              </span>
            </div>

            <div className="text-sm text-gray-700 space-y-1">
              <div>
                <strong>Infirmier :</strong> {soin.infirmier?.noms || "-"}
              </div>
              {soin.medecin && (
                <div>
                  <strong>Médecin :</strong> {soin.medecin.noms}
                </div>
              )}
              {soin.observations && (
                <div>
                  <strong>Observations :</strong> {soin.observations}
                </div>
              )}
              {soin.remarque_medecin && (
                <div>
                  <strong>Remarque médecin :</strong> {soin.remarque_medecin}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
