// src/api/medicaments.js
import api from "../../services/api";

/**
 * 📋 Récupérer tous les médicaments
 */
export const getMedicaments = async () => {
  try {
    const res = await api.get("/medicaments");
    console.log("📥 Médicaments reçus :", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Erreur getMedicaments :", error);
    throw error;
  }
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
    console.error("❌ Erreur createMedicament :", error);
    throw error;
  }
};

/**
 * ✏️ Mettre à jour un médicament
 */
export const updateMedicament = async (id, payload) => {
  try {
    if (!id) throw new Error("ID médicament manquant");
    console.log(`✏️ PUT /medicaments/${id} →`, payload);
    const res = await api.put(`/medicaments/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error("❌ Erreur updateMedicament :", error);
    throw error;
  }
};

/**
 * 🗑️ Supprimer un médicament
 */
export const deleteMedicament = async (id) => {
  try {
    if (!id) throw new Error("ID médicament manquant");
    console.log(`🗑️ DELETE /medicaments/${id}`);
    const res = await api.delete(`/medicaments/${id}`);
    return res.data;
  } catch (error) {
    console.error("❌ Erreur deleteMedicament :", error);
    throw error;
  }
};
