import { useState } from "react";
import HospitalisationsSection from "./sections/HospitalisationsSection";
import ConsultationsSection from "./sections/ConsultationsSection";
import SoinsInfirmiersSection from "./sections/SoinsInfirmiersSection";
import ExamensSection from "./sections/ExamensSection";

export default function CarnetTabs({ carnet }) {
  const patient = carnet?.patient;
  if (!carnet || !patient) return <div>Aucune donnée disponible</div>;

  const tabs = [
    {
      name: "Hospitalisations",
      component: (
        <HospitalisationsSection
          hospitalisations={carnet.hospitalisations || []}
          patientId={patient.id}
        />
      ),
    },
    {
      name: "Consultations",
      component: (
        <ConsultationsSection consultations={carnet.consultations || []} />
      ),
    },
    {
      name: "Soins infirmiers",
      component: (
        <SoinsInfirmiersSection
          hospitalisations={carnet.hospitalisations || []}
          patientId={patient.id}
        />
      ),
    },
    {
      name: "Examens",
      component: (
        <ExamensSection examens={carnet.examens || []} patientId={patient.id} />
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
            className={`px-4 py-2 whitespace-nowrap font-medium rounded-t ${
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
        {tabs.find((t) => t.name === activeTab)?.component}
      </div>
    </div>
  );
}
