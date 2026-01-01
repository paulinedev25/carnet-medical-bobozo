// src/api/patients.js
import api from "../services/api";

// ✅ Récupérer la liste des patients avec pagination et recherche
export const getPatients = async (token, params = {}) => {
  const res = await api.get("/patients", { params });
  return res.data; // 🔹 Très important : retourner seulement le JSON
};

// ✅ Créer un patient
export const createPatient = async (token, payload) => {
  const res = await api.post("/patients", payload);
  return res.data;
};

// ✅ Mettre à jour un patient
export const updatePatient = async (token, id, payload) => {
  const res = await api.put(`/patients/${id}`, payload);
  return res.data;
};

// ✅ Supprimer un patient
export const deletePatient = async (token, id) => {
  const res = await api.delete(`/patients/${id}`);
  return res.data;
};
