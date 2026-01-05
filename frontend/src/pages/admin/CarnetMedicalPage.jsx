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
    const fetchCarnet = async () => {
      try {
        const res = await api.get(`/carnet/${patientId}`);
        setCarnet(res.data);
      } catch (err) {
        console.error("Erreur chargement carnet", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCarnet();
  }, [patientId]);

  if (loading) return <div>Chargement...</div>;
  if (!carnet) return <div>Aucune donnée disponible pour ce patient.</div>;

  return (
    <div className="p-6">
      <PatientHeader patient={carnet.patient} />
      <CarnetTabs carnet={carnet} />
    </div>
  );
}
