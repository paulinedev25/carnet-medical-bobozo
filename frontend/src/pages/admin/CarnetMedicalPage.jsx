import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import CarnetTabs from "../../components/carnetMedical/CarnetTabs";
import PatientHeader from "../../components/carnetMedical/PatientHeader";

export default function CarnetMedicalPage() {
  const { patientId } = useParams();
  const [carnet, setCarnet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCarnet = async () => {
      try {
        const res = await api.get(`/carnet-medical/${patientId}`);
        setCarnet(res.data);
      } catch (err) {
        console.error("Erreur chargement carnet", err);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) loadCarnet();
  }, [patientId]);

  if (loading) return <p>Chargement...</p>;
  if (!carnet) return <p>Aucun carnet trouvé</p>;

  return (
    <div className="space-y-4">
      <PatientHeader patient={carnet.patient} />
      <CarnetTabs carnet={carnet} />
    </div>
  );
}
