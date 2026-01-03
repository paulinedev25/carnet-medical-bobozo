import api from "../services/api";

/**
 * 📋 Liste des hospitalisations (pagination + filtre statut)
 */
export const getHospitalisations = async ({ page = 1, limit = 10, statut = "" } = {}) => {
  try {
    const res = await api.get("/hospitalisations", {
      params: { page, limit, statut },
    });

    console.log("📥 Hospitalisations reçues :", res.data);

    // Backend renvoie { rows, count, page, limit }
    return {
      rows: res.data?.rows || [],
      count: res.data?.count || 0,
      page: res.data?.page || page,
      limit: res.data?.limit || limit,
    };
  } catch (err) {
    console.error("❌ Erreur getHospitalisations :", err);
    throw err.response?.data || err;
  }
};

/**
 * ➕ Créer une hospitalisation
 */
export const createHospitalisation = async (payload) => {
  try {
    const res = await api.post("/hospitalisations", payload);
    return res.data;
  } catch (err) {
    console.error("❌ Erreur createHospitalisation :", err);
    throw err.response?.data || err;
  }
};

/**
 * ✏️ Mettre à jour une hospitalisation
 */
export const updateHospitalisation = async (id, payload) => {
  try {
    const res = await api.put(`/hospitalisations/${id}`, payload);
    return res.data;
  } catch (err) {
    console.error("❌ Erreur updateHospitalisation :", err);
    throw err.response?.data || err;
  }
};

/**
 * ❌ Supprimer une hospitalisation
 */
export const deleteHospitalisation = async (id) => {
  try {
    const res = await api.delete(`/hospitalisations/${id}`);
    return res.data;
  } catch (err) {
    console.error("❌ Erreur deleteHospitalisation :", err);
    throw err.response?.data || err;
  }
};

/**
 * 🔄 Changer le statut d’une hospitalisation
 */
export const changerStatutHospitalisation = async (id, payload) => {
  try {
    const res = await api.put(`/hospitalisations/${id}/statut`, payload);
    return res.data;
  } catch (err) {
    console.error("❌ Erreur changerStatutHospitalisation :", err);
    throw err.response?.data || err;
  }
};

/**
 * 📊 Dashboard hospitalisations
 */
export const getHospitalisationDashboard = async () => {
  try {
    const res = await api.get("/hospitalisations/dashboard/stats");
    return res.data;
  } catch (err) {
    console.error("❌ Erreur getHospitalisationDashboard :", err);
    throw err.response?.data || err;
  }
};
