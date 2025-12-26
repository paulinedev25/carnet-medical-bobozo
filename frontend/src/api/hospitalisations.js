// src/api/hospitalisations.js
import api from "../services/api";

/**
 * 📋 Lire hospitalisations (pagination + filtre)
 */
export const getHospitalisations = async ({ page = 1, limit = 10, statut = "" } = {}) => {
  try {
    const res = await api.get("/hospitalisations", {
      params: { page, limit, statut },
    });

    console.log("📥 Hospitalisations reçues :", res.data);

    // Cas 1 : tableau simple
    if (Array.isArray(res.data)) {
      return { rows: res.data, count: res.data.length, page, limit };
    }

    // Cas 2 : objet paginé
    if (res.data?.rows) {
      return {
        rows: res.data.rows,
        count: res.data.count ?? res.data.rows.length,
        page: res.data.page ?? page,
        limit: res.data.limit ?? limit,
      };
    }

    console.warn("⚠️ Réponse inattendue backend :", res.data);
    return { rows: [], count: 0, page, limit };
  } catch (error) {
    console.error("❌ Erreur getHospitalisations :", error);
    throw error;
  }
};

/**
 * ➕ Créer une hospitalisation
 */
export const createHospitalisation = async (payload) => {
  try {
    console.log("📤 POST /hospitalisations →", payload);
    const res = await api.post("/hospitalisations", payload);
    return res.data;
  } catch (error) {
    console.error("❌ Erreur createHospitalisation :", error);
    throw error;
  }
};

/**
 * ✏️ Mettre à jour une hospitalisation
 */
export const updateHospitalisation = async (id, payload) => {
  try {
    if (!id) throw new Error("ID hospitalisation manquant");
    console.log(`✏️ PUT /hospitalisations/${id} →`, payload);
    const res = await api.put(`/hospitalisations/${id}`, payload);
    return res.data;
  } catch (error) {
    console.error("❌ Erreur updateHospitalisation :", error);
    throw error;
  }
};

/**
 * 🗑️ Supprimer une hospitalisation
 */
export const deleteHospitalisation = async (id) => {
  try {
    if (!id) throw new Error("ID hospitalisation manquant");
    console.log(`🗑️ DELETE /hospitalisations/${id}`);
    const res = await api.delete(`/hospitalisations/${id}`);
    return res.data;
  } catch (error) {
    console.error("❌ Erreur deleteHospitalisation :", error);
    throw error;
  }
};
