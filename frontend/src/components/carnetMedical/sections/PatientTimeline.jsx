import React from "react";

export default function PatientTimeline({ hospitalisations, consultations, examens, soins }) {
  return (
    <div className="space-y-6">
      {/* Hospitalisations */}
      <div>
        <h3 className="font-semibold text-blue-700 mb-2">🏥 Hospitalisations</h3>
        {hospitalisations?.length > 0 ? (
          hospitalisations.map((h) => (
            <div key={h.id} className="border-l-2 border-blue-300 pl-3 py-2 relative">
              <span className="absolute -left-2 top-2 w-3 h-3 bg-blue-600 rounded-full"></span>
              <p>
                <strong>Date entrée:</strong>{" "}
                {h.date_entree ? new Date(h.date_entree).toLocaleString("fr-FR") : "-"}
              </p>
              <p>
                <strong>Date sortie:</strong>{" "}
                {h.date_sortie ? new Date(h.date_sortie).toLocaleString("fr-FR") : "-"}
              </p>
              <p>
                <strong>Service:</strong> {h.service || "-"}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Aucune hospitalisation enregistrée</p>
        )}
      </div>

      {/* Consultations */}
      <div>
        <h3 className="font-semibold text-green-700 mb-2">🩺 Consultations</h3>
        {consultations?.length > 0 ? (
          consultations.map((c) => (
            <div key={c.id} className="border-l-2 border-green-300 pl-3 py-2 relative">
              <span className="absolute -left-2 top-2 w-3 h-3 bg-green-600 rounded-full"></span>
              <p>
                <strong>Date:</strong>{" "}
                {c.date_consultation ? new Date(c.date_consultation).toLocaleString("fr-FR") : "-"}
              </p>
              <p>
                <strong>Médecin:</strong> {c.medecin?.noms || "-"}
              </p>
              <p>
                <strong>Motif:</strong> {c.motif || "-"}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Aucune consultation enregistrée</p>
        )}
      </div>

      {/* Examens */}
      <div>
        <h3 className="font-semibold text-purple-700 mb-2">🧪 Examens</h3>
        {examens?.length > 0 ? (
          examens.map((e) => (
            <div key={e.id} className="border-l-2 border-purple-300 pl-3 py-2 relative">
              <span className="absolute -left-2 top-2 w-3 h-3 bg-purple-600 rounded-full"></span>
              <p>
                <strong>Type:</strong> {e.type_examen || "-"}
              </p>
              <p>
                <strong>Date:</strong> {e.date_examen ? new Date(e.date_examen).toLocaleString("fr-FR") : "-"}
              </p>
              <p>
                <strong>Résultat:</strong> {e.resultat || "-"}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Aucun examen enregistré</p>
        )}
      </div>

      {/* Soins infirmiers */}
      <div>
        <h3 className="font-semibold text-yellow-700 mb-2">🩺 Soins infirmiers</h3>
        {soins?.length > 0 ? (
          soins.map((s) => (
            <div key={s.id} className="border-l-2 border-yellow-300 pl-3 py-2 relative">
              <span className="absolute -left-2 top-2 w-3 h-3 bg-yellow-600 rounded-full"></span>
              <p>
                <strong>Type:</strong> {s.type_soin || "-"}
              </p>
              <p>
                <strong>Infirmier:</strong> {s.infirmier?.noms || "-"}
              </p>
              <p>
                <strong>Date:</strong> {s.date_soin ? new Date(s.date_soin).toLocaleString("fr-FR") : "-"}
              </p>
              <p>
                <strong>Observations:</strong> {s.observations || "-"}
              </p>
              <p>
                <strong>Statut validation:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    s.statut_validation === "valide"
                      ? "bg-green-100 text-green-700"
                      : s.statut_validation === "rejete"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {s.statut_validation}
                </span>
              </p>
              {s.remarque_medecin && (
                <p>
                  <strong>Remarque médecin:</strong> {s.remarque_medecin}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">Aucun soin infirmier enregistré</p>
        )}
      </div>
    </div>
  );
}
