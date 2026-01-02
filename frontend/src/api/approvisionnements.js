// src/api/approvisionnements.js
import api from "../services/api";

// Crée un approvisionnement pour un médicament
export const createApprovisionnement = async (token, payload) => {
  const response = await api.post("/approvisionnements", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Récupère l'historique des approvisionnements d'un médicament
export const getHistoriqueApprovisionnement = async (token, medicamentId) => {
  const response = await api.get(`/approvisionnements/${medicamentId}/historique`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
