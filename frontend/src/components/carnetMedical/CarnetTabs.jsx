import { useState } from "react";

import ConsultationsSection from "./sections/ConsultationsSection";
import ExamensSection from "./sections/ExamensSection";
import PrescriptionsSection from "./sections/PrescriptionsSection";
import HospitalisationsSection from "./sections/HospitalisationsSection";
import SoinsInfirmiersSection from "./sections/SoinsInfirmiersSection";
import RendezVousSection from "./sections/RendezVousSection";

const TABS = [
  { key: "consultations", label: "Consultations" },
  { key: "examens", label: "Examens" },
  { key: "prescriptions", label: "Prescriptions" },
  { key: "hospitalisations", label: "Hospitalisations" },
  { key: "soins", label: "Soins infirmiers" },
  { key: "rendezvous", label: "Rendez-vous" },
];

export default function CarnetTabs({ carnet }) {
  const [active, setActive] = useState("consultations");

  return (
    <div className="bg-white rounded shadow">
      {/* Tabs */}
      <div className="flex border-b">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`px-4 py-2 text-sm ${
              active === t.key
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4">
        {active === "consultations" && (
          <ConsultationsSection data={carnet.consultations} />
        )}
        {active === "examens" && (
          <ExamensSection data={carnet.examens} />
        )}
        {active === "prescriptions" && (
          <PrescriptionsSection data={carnet.prescriptions} />
        )}
        {active === "hospitalisations" && (
          <HospitalisationsSection data={carnet.hospitalisations} />
        )}
        {active === "soins" && (
          <SoinsInfirmiersSection data={carnet.soinsInfirmiers} />
        )}
        {active === "rendezvous" && (
          <RendezVousSection data={carnet.rendezVous} />
        )}
      </div>
    </div>
  );
}
