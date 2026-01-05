// src/pages/admin/CarnetMedicalPage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import PatientHeader from "../../components/carnetMedical/PatientHeader";
import CarnetTabs from "../../components/carnetMedical/CarnetTabs";

export default function CarnetMedicalPage() {
  const { patientId } = useParams();
  const [carnet, setCarnet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!patientId) return;

    const loadCarnet = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/carnet-medical/${patientId}`);
        setCarnet(res.data);
      } catch (err) {
        console.error("Erreur chargement carnet", err);
        setError("Impossible de charger le carnet médical");
      } finally {
        setLoading(false);
      }
    };

    loadCarnet();
  }, [patientId]);

  if (loading) return <div className="p-6">Chargement...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!carnet) return <div className="p-6">Aucune donnée</div>;

  return (
    <div className="p-6 space-y-4">
      <PatientHeader patient={carnet.patient} />
      <CarnetTabs carnet={carnet} />
    </div>
  );
}
