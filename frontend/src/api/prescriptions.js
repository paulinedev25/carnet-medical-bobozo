// src/api/prescriptions.js
import api from "../services/api";

/**
 * 📋 Liste des prescriptions (option filtres)
 * params: { page, limit, statut, consultation_id, medicament_id, search }
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
 * payload: { consultation_id, medicament_id?, medicament_nom?, posologie, duree, observations?, quantite }
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
 * ✏️ Mettre à jour une prescription (Pharmacien / Admin)
 * payload: { statut?, observations?, medicament_id?, medicament_nom?, quantite? }
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
 * 💊 Délivrer une prescription (Pharmacien / Admin)
 * payload: { quantite_delivree }
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
 * 📋 Prescriptions par consultation
 */
export const getPrescriptionsByConsultation = async (consultation_id) => {
  try {
    const res = await api.get(`/prescriptions/consultation/${consultation_id}`);
    return res.data;
  } catch (error) {
    console.error("❌ Erreur getPrescriptionsByConsultation :", error);
    throw error;
  }
};

/**
 * 📊 Dashboard / Statistiques
 */
export const getPrescriptionDashboard = async () => {
  try {
    const res = await api.get("/prescriptions/dashboard");
    return res.data;
  } catch (error) {
    console.error("❌ Erreur getPrescriptionDashboard :", error);
    throw error;
  }
};
