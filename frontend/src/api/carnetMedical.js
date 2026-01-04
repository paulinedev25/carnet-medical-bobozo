import api from "../services/api";

/**
 * 📘 Récupérer le carnet médical complet d’un patient
 */
export const getCarnetMedical = async (patientId) => {
  const res = await api.get(`/carnet-medical/${patientId}`);
  return res.data;
};
