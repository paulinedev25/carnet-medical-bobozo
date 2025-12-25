import api from "./api"; // ton axios déjà configuré

// 📋 Liste
export const fetchHospitalisations = async () => {
  const res = await api.get("/hospitalisations");
  return res.data;
};

// ➕ Créer
export const createHospitalisation = async (data) => {
  const res = await api.post("/hospitalisations", data);
  return res.data;
};

// 🔎 Détails
export const getHospitalisation = async (id) => {
  const res = await api.get(`/hospitalisations/${id}`);
  return res.data;
};

// ✏️ Modifier
export const updateHospitalisation = async (id, data) => {
  const res = await api.put(`/hospitalisations/${id}`, data);
  return res.data;
};

// ❌ Supprimer
export const deleteHospitalisation = async (id) => {
  const res = await api.delete(`/hospitalisations/${id}`);
  return res.data;
};
