// src/components/carnetMedical/CarnetTabs.jsx
import { useState } from "react";
import SoinsInfirmiersSection from "./sections/SoinsInfirmiersSection";
import HospitalisationsSection from "./sections/HospitalisationsSection";
import ConsultationsSection from "./sections/ConsultationsSection";
import ExamensSection from "./sections/ExamensSection";

export default function CarnetTabs({ carnet }) {
  const patient = carnet?.patient;
  if (!carnet || !patient) return <div>Aucune donnée disponible</div>;

  const tabs = [
    { name: "Hospitalisations", component: <HospitalisationsSection hospitalisations={carnet.hospitalisations} /> },
    { name: "Consultations", component: <ConsultationsSection consultations={carnet.consultations} /> },
    { name: "Soins infirmiers", component: <SoinsInfirmiersSection data={carnet.soins_infirmiers} /> },
    { name: "Examens", component: <ExamensSection examens={carnet.examens} /> },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].name);

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 border-b mb-4">
        {tabs.map((t) => (
          <button
            key={t.name}
            onClick={() => setActiveTab(t.name)}
            className={`px-4 py-2 rounded-t ${
              t.name === activeTab ? "bg-white border-t border-l border-r border-blue-600 font-semibold" : "bg-gray-100"
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Contenu actif */}
      <div className="bg-white p-4 rounded shadow">
        {tabs.find((t) => t.name === activeTab)?.component}
      </div>
    </div>
  );
}
