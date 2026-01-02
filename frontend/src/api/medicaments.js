// src/api/medicaments.js
import api from "../services/api";

/**
 * 📋 Récupérer tous les médicaments
 */
export const getMedicaments = async () => {
  try {
    const res = await api.get("/medicaments");
    const data = Array.isArray(res.data) ? res.data : [];
    console.log("📥 Médicaments reçus :", data);
    return data;
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
    if (!payload || !payload.nom_commercial) {
      throw new Error("Nom commercial obligatoire pour créer un médicament");
    }
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
    if (!id) throw new Error("ID médicament manquant");
    if (!payload) throw new Error("Payload manquant pour mise à jour");
    console.log(`✏️ PUT /medicaments/${id} →`, payload);
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
    if (!id) throw new Error("ID médicament manquant");
    console.log(`🗑️ DELETE /medicaments/${id}`);
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
    if (!id) throw new Error("ID médicament manquant");
    if (!quantite || quantite <= 0) throw new Error("Quantité invalide pour réapprovisionnement");

    console.log(`♻️ POST /medicaments/${id}/reapprovisionner →`, { quantite });
    const res = await api.post(`/medicaments/${id}/reapprovisionner`, { quantite });
    return res.data;
  } catch (error) {
    console.error("❌ Erreur reapprovisionnerMedicament :", error.response?.data || error);
    throw error;
  }
};

/**
 * 🚨 Obtenir alertes stock (rupture ou seuil)
 */
export const getAlertesStock = async () => {
  try {
    const res = await api.get("/medicaments/alertes-stock");
    const data = Array.isArray(res.data) ? res.data : [];
    console.log("🚨 Alertes stock :", data);
    return data;
  } catch (error) {
    console.error("❌ Erreur getAlertesStock :", error.response?.data || error);
    throw error;
  }
};
