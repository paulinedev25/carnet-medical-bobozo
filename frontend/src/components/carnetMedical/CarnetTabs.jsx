// src/components/carnetMedical/CarnetTabs.jsx
import { useState } from "react";

import ConsultationsSection from "./sections/ConsultationsSection";
import ExamensSection from "./sections/ExamensSection";
import SoinsInfirmiersSection from "./sections/SoinsInfirmiersSection";
import PrescriptionsSection from "./sections/PrescriptionsSection";

export default function CarnetTabs({ carnet }) {
  const [activeTab, setActiveTab] = useState("consultations");

  const tabs = [
    { key: "consultations", label: "Consultations" },
    { key: "examens", label: "Examens" },
    { key: "soins", label: "Soins infirmiers" },
    { key: "prescriptions", label: "Prescriptions" },
  ];

  return (
    <div>
      {/* Onglets */}
      <div className="flex border-b mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 font-semibold ${
              activeTab === tab.key
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenu onglet actif */}
      <div className="space-y-4">
        {activeTab === "consultations" && (
          <ConsultationsSection consultations={carnet.consultations || []} />
        )}
        {activeTab === "examens" && (
          <ExamensSection examens={carnet.examens || []} />
        )}
        {activeTab === "soins" && (
          <SoinsInfirmiersSection soins={carnet.soins_infirmiers || []} />
        )}
        {activeTab === "prescriptions" && (
          <PrescriptionsSection prescriptions={carnet.prescriptions || []} />
        )}
      </div>
    </div>
  );
}
