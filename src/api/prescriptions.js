// src/api/prescriptions.js
import api from "../services/api";

/**
 * 📋 Liste des prescriptions (avec filtres)
 */
export const getPrescriptions = async (params = {}) => {
  try {
    const res = await api.get("/prescriptions", { params });
    return res.data;
  } catch (error) {
    console.error("❌ Erreur getPrescriptions :", error);
    throw error;
  }
};

/**
 * 🧾 Créer une prescription (Médecin / Admin)
 */
export const createPrescription = async (payload) => {
  try {
    const res = await api.post("/prescriptions", payload);
    return res.data;
  } catch (error) {
    console.error("❌ Erreur createPrescription :", error);
    throw error;
  }
};

/**
 * 💊 Mettre à jour une prescription (Pharmacien / Admin)
 */
export const updatePrescription = async (id, payload) => {
  try {
    const res = await api.put(`/prescriptions/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error("❌ Erreur updatePrescription :", error);
    throw error;
  }
};

/**
 * 🗑️ Supprimer une prescription (Admin / Médecin)
 */
export const deletePrescription = async (id) => {
  try {
    const res = await api.delete(`/prescriptions/${id}`);
    return res.data;
  } catch (error) {
    console.error("❌ Erreur deletePrescription :", error);
    throw error;
  }
};

/**
 * 💊 Délivrer une prescription (Pharmacien / Admin)
 * Ex: { quantite_delivree: 1, unite: 'mg', observations: '...' }
 */
export const deliverPrescription = async (id, payload) => {
  try {
    const res = await api.put(`/prescriptions/${id}/delivrer`, payload);
    return res.data;
  } catch (error) {
    console.error("❌ Erreur deliverPrescription :", error);
    throw error;
  }
};
