import { useState } from "react";
import HospitalisationsSection from "./sections/HospitalisationsSection";
import ConsultationsSection from "./sections/ConsultationsSection";
import SoinsInfirmiersSection from "./sections/SoinsInfirmiersSection";
import ExamensSection from "./sections/ExamensSection";

export default function CarnetTabs({ carnet }) {
  const patient = carnet?.patient;

  // Si pas de carnet ou pas de patient défini
  if (!carnet || !patient) {
    return (
      <div className="p-6 text-center text-gray-700">
        Aucune donnée du carnet médical disponible.
      </div>
    );
  }

  // Récupère tous les soins si présents
  const allSoins = Array.isArray(carnet.hospitalisations)
    ? carnet.hospitalisations.flatMap((hosp) => hosp?.soins || [])
    : [];

  const tabs = [
    {
      name: "Hospitalisations",
      component: (
        <HospitalisationsSection
          hospitalisations={carnet.hospitalisations || []}
          patientId={patient?.id} // sécurisé avec optional chaining
        />
      ),
    },
    {
      name: "Consultations",
      component: (
        <ConsultationsSection
          consultations={carnet.consultations || []}
          patientId={patient?.id} // éventuellement utile pour les filtres
        />
      ),
    },
    {
      name: "Soins infirmiers",
      component: (
        <SoinsInfirmiersSection
          data={allSoins}
          patientId={patient?.id}
        />
      ),
    },
    {
      name: "Examens",
      component: (
        <ExamensSection
          examens={carnet.examens || []}
          patientId={patient?.id}
        />
      ),
    },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].name);

  return (
    <div className="w-full">
      {/* Onglets */}
      <div className="flex gap-2 border-b mb-4 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.name}
            onClick={() => setActiveTab(t.name)}
            className={`px-4 py-2 whitespace-nowrap font-medium rounded-t 
              ${
                t.name === activeTab
                  ? "bg-white border-t border-l border-r border-blue-600 text-blue-800"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Contenu de l’onglet */}
      <div className="bg-white p-4 rounded shadow min-h-[300px]">
        {tabs.find((t) => t.name === activeTab)?.component || (
          <div className="text-center text-gray-500">
            Aucun contenu disponible.
          </div>
        )}
      </div>
    </div>
  );
}
