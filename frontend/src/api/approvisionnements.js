// src/api/approvisionnements.js
import api from "../services/api";

/**
 * ➕ Créer un approvisionnement pour un médicament
 */
export const createApprovisionnement = async (payload) => {
  if (!payload?.medicament_id) {
    throw new Error("ID médicament manquant pour l'approvisionnement");
  }

  const response = await api.post("/approvisionnements", payload);
  return response.data;
};

/**
 * 📊 Récupérer l'historique des approvisionnements d'un médicament
 */
export const getHistoriqueApprovisionnement = async (medicamentId) => {
  if (!medicamentId) {
    throw new Error("ID médicament manquant pour l'historique");
  }

  const response = await api.get(`/approvisionnements/${medicamentId}/historique`);
  return response.data;
};
