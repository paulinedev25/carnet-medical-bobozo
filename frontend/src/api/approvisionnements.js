// src/api/approvisionnements.js
import api from "../../services/api";

/**
 * ➕ Créer un approvisionnement
 */
export const createApprovisionnement = async (payload) => {
  const res = await api.post("/approvisionnements", payload);
  return res.data;
};

/**
 * 📜 Récupérer l’historique des approvisionnements d’un médicament
 */
export const getApprovisionnementsByMedicament = async (medicamentId) => {
  const res = await api.get(`/approvisionnements/medicament/${medicamentId}`);
  return res.data;
};
