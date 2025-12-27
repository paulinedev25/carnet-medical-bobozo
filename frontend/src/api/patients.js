// src/api/patients.js
import api from "../../services/api";

/**
 * 📋 Liste paginée + recherche
 */
export async function getPatients({ page = 1, limit = 10, search = "" } = {}) {
  try {
    const res = await api.get("/patients", { params: { page, limit, search } });
    const data = res.data;

    return {
      rows: data.patients || [],
      count: Number(data.total) || (data.patients ? data.patients.length : 0),
      page: Number(data.page) || page,
      limit: Number(data.limit) || limit,
    };
  } catch (error) {
    console.error("❌ Erreur getPatients :", error);
    throw error;
  }
}

/**
 * 🔍 Détails patient par ID
 */
export async function getPatientById(id) {
  try {
    const res = await api.get(`/patients/${id}`);
    return res.data;
  } catch (error) {
    console.error("❌ Erreur getPatientById :", error);
    throw error;
  }
}

/**
 * ➕ Créer patient
 */
export async function createPatient(payload) {
  try {
    const res = await api.post("/patients", payload);
    return res.data; // { message, patient }
  } catch (error) {
    console.error("❌ Erreur createPatient :", error);
    throw error;
  }
}

/**
 * ✏️ Mettre à jour patient
 */
export async function updatePatient(id, payload) {
  try {
    const res = await api.put(`/patients/${id}`, payload);
    return res.data; // { message, patient }
  } catch (error) {
    console.error("❌ Erreur updatePatient :", error);
    throw error;
  }
}

/**
 * 🗑️ Supprimer patient
 */
export async function deletePatient(id) {
  try {
    const res = await api.delete(`/patients/${id}`);
    return res.data;
  } catch (error) {
    console.error("❌ Erreur deletePatient :", error);
    throw error;
  }
}
