import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import PatientHeader from "../../components/carnetMedical/PatientHeader";
import CarnetTabs from "../../components/carnetMedical/CarnetTabs";

export default function CarnetMedicalPage() {
  const { patientId } = useParams();
  const [carnet, setCarnet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarnet = async () => {
      try {
        console.log("📡 Chargement carnet patient:", patientId);

        const res = await api.get(`/carnet-medical/${patientId}`);

        console.log("✅ Réponse carnet:", res.data);

        setCarnet(res.data);
      } catch (err) {
        console.error("❌ Erreur chargement carnet", err);
        setError("Impossible de charger le carnet médical");
      } finally {
        setLoading(false);
      }
    };

    if (patientId) fetchCarnet();
    else {
      setError("Patient non défini");
      setLoading(false);
    }
  }, [patientId]);

  if (loading) return <p className="p-6">Chargement...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!carnet) return <p className="p-6">Aucune donnée</p>;

  return (
    <div className="p-6 space-y-4">
      <PatientHeader patient={carnet.patient} />
      <CarnetTabs carnet={carnet} />
    </div>
  );
}
