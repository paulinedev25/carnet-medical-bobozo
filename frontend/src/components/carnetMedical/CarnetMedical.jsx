import React, { useEffect, useState } from "react";
import PatientInfo from "./PatientInfo";
import ConsultationsTable from "./ConsultationsTable";
import HospitalisationDetails from "./HospitalisationDetails";
import RendezVousTable from "./RendezVousTable";
import { getCarnetMedical } from "../../services/patient.service";

export default function CarnetMedical({ patientId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const result = await getCarnetMedical(patientId);
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [patientId]);

  if (loading) return <p>Chargement...</p>;
  if (!data) return <p>Impossible de charger le carnet médical</p>;

  const { patient, hospitalisations, consultations } = data;

  return (
    <div>
      <PatientInfo patient={patient} />

      <h2>Consultations</h2>
      <ConsultationsTable consultations={consultations} />

      {hospitalisations && hospitalisations.length > 0 && (
        <HospitalisationDetails hospitalisation={hospitalisations[0]} />
      )}

      <h2>Rendez‑vous de suivi</h2>
      <RendezVousTable patientId={patient.id} />
    </div>
  );
}
