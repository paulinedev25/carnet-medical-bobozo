import api from "./api";

export const getCarnetMedical = async (patientId) => {
  const res = await api.get(`/carnet-medical/${patientId}`);
  return res.data;
};
