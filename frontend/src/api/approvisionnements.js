// src/api/approvisionnements.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * ➕ Créer un approvisionnement
 */
export const createApprovisionnement = async (token, payload) => {
  const res = await axios.post(`${API_URL}/approvisionnements`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

/**
 * 📜 Récupérer l’historique des approvisionnements d’un médicament
 * @param {string} token - Jeton JWT
 * @param {number|string} medicamentId - ID du médicament
 * @returns {Promise<Array>} Tableau des approvisionnements
 */
export const getApprovisionnementsByMedicament = async (token, medicamentId) => {
  const res = await axios.get(
    `${API_URL}/approvisionnements/medicament/${medicamentId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};
