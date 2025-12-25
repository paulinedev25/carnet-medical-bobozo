// src/api/prescriptions.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// 📋 Liste des prescriptions
export const getPrescriptions = async (token, params = {}) => {
  const res = await axios.get(`${API_URL}/prescriptions`, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return res.data;
};

// 🧾 Créer une prescription (Médecin / Admin)
export const createPrescription = async (token, payload) => {
  const res = await axios.post(`${API_URL}/prescriptions`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// 💊 Mettre à jour une prescription (Pharmacien / Admin)
export const updatePrescription = async (token, id, payload) => {
  const res = await axios.put(`${API_URL}/prescriptions/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// 🗑️ Supprimer une prescription (Admin / Médecin)
export const deletePrescription = async (token, id) => {
  const res = await axios.delete(`${API_URL}/prescriptions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * 💊 Délivrer une prescription (Pharmacien / Admin)
 * Ex: { quantite_delivree: 1, unite: 'mg', observations: '...' }
 * Si stock insuffisant, backend renvoie 400 avec { rupture: true, message: '...' }
 */
export const deliverPrescription = async (token, id, payload) => {
  const res = await axios.put(`${API_URL}/prescriptions/${id}/delivrer`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
