import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { getCarnetMedical } from "../../api/carnetMedical";
import PatientHeader from "../../components/carnetMedical/PatientHeader";
import CarnetTabs from "../../components/carnetMedical/CarnetTabs";

export default function CarnetMedicalPage() {
  const { patientId } = useParams();
  const [carnet, setCarnet] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!patientId) return;

    const loadCarnet = async () => {
      setLoading(true);
      try {
        const res = await getCarnetMedical(patientId);
        // La réponse doit être { patient, hospitalisations, consultations, soins_infirmiers, examens }
        setCarnet(res);
      } catch (err) {
        console.error(err);
        toast.error("❌ Impossible de charger le carnet médical");
        setCarnet(null);
      } finally {
        setLoading(false);
      }
    };

    loadCarnet();
  }, [patientId]);

  if (loading) return <div className="p-6">Chargement du carnet médical...</div>;
  if (!carnet || !carnet.patient)
    return <div className="p-6 text-red-500">Aucune donnée disponible</div>;

  return (
    <div className="p-6 space-y-4">
      <PatientHeader patient={carnet.patient} />
      <CarnetTabs carnet={carnet} />
    </div>
  );
}
