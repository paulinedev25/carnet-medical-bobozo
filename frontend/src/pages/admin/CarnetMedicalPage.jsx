import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { getCarnetMedical } from "../../api/carnetMedical";

import PatientHeader from "../../components/carnetMedical/PatientHeader";
import CarnetTabs from "../../components/carnetMedical/CarnetTabs";

export default function CarnetMedicalPage() {
  const { patientId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!patientId) return;

    const load = async () => {
      setLoading(true);
      try {
        const res = await getCarnetMedical(patientId);
        setData(res);
      } catch (err) {
        console.error(err);
        toast.error("❌ Impossible de charger le carnet médical");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [patientId]);

  if (loading) {
    return <div className="p-6">Chargement du carnet médical...</div>;
  }

  if (!data) {
    return <div className="p-6 text-red-500">Aucune donnée disponible</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <PatientHeader patient={data.patient} />
      <CarnetTabs carnet={data} />
    </div>
  );
}
