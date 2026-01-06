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
        setLoading(true);
        setError(null);

        console.log("📡 Chargement du carnet médical pour patient:", patientId);

        // Requête API vers ton backend pour récupérer le carnet
        const res = await api.get(`/carnet-medical/${patientId}`);

        console.log("✅ Carnet médical reçu:", res.data);

        setCarnet(res.data || null);
      } catch (err) {
        console.error("❌ Erreur lors de la récupération du carnet médical:", err);

        // Message clair pour l'utilisateur en cas d'erreur API
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Impossible de charger le carnet médical.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchCarnet();
    } else {
      setError("Identifiant patient non défini.");
      setLoading(false);
    }
  }, [patientId]);

  // ⏳ Affiche le loading tant que la requête est en cours
  if (loading) {
    return (
      <div className="p-6 text-center text-lg font-medium">
        Chargement du carnet médical...
      </div>
    );
  }

  // ⚠️ Affiche l'erreur si présente
  if (error) {
    return (
      <div className="p-6 text-center text-red-600 text-lg">
        {error}
      </div>
    );
  }

  // 🧾 Si aucune donnée retournée ou patient inexistant
  if (!carnet || !carnet.patient) {
    return (
      <div className="p-6 text-center text-gray-700 text-lg">
        Aucune donnée disponible pour ce patient.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête patient (affiche proprement les données sans planter si undefined) */}
      <PatientHeader patient={carnet.patient} />

      {/* Onglets avec contenus (chaque tab doit bien se protéger contre nulls) */}
      <CarnetTabs carnet={carnet} />
    </div>
  );
}
