// src/api/medicaments.js
import api from "../services/api";

/**
 * 📋 Récupérer tous les médicaments
 */
export const getMedicaments = async () => {
  const res = await api.get("/medicaments");
  return Array.isArray(res.data) ? res.data : [];
};

/**
 * ➕ Créer un médicament
 */
export const createMedicament = async (payload) => {
  try {
    console.log("📤 POST /medicaments →", payload);
    const res = await api.post("/medicaments", payload);
    return res.data;
  } catch (error) {
    console.error("❌ Erreur createMedicament :", error.response?.data || error);
    throw error;
  }
};

/**
 * ✏️ Mettre à jour un médicament
 */
export const updateMedicament = async (id, payload) => {
  try {
    const res = await api.put(`/medicaments/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error("❌ Erreur updateMedicament :", error.response?.data || error);
    throw error;
  }
};

/**
 * 🗑️ Supprimer un médicament
 */
export const deleteMedicament = async (id) => {
  try {
    const res = await api.delete(`/medicaments/${id}`);
    return res.data;
  } catch (error) {
    console.error("❌ Erreur deleteMedicament :", error.response?.data || error);
    throw error;
  }
};

/**
 * ♻️ Réapprovisionner un médicament
 */
export const reapprovisionnerMedicament = async (id, quantite) => {
  try {
    const res = await api.post(`/medicaments/${id}/reapprovisionner`, {
      quantite,
    });
    return res.data;
  } catch (error) {
    console.error(
      "❌ Erreur reapprovisionnerMedicament :",
      error.response?.data || error
    );
    throw error;
  }
};

/**
 * 🚨 Alertes stock
 */
export const getAlertesStock = async () => {
  const res = await api.get("/medicaments/alertes");
  return Array.isArray(res.data) ? res.data : [];
};
