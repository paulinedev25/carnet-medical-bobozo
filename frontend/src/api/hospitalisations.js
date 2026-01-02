import api from "../services/api";

export const getHospitalisations = async ({ page = 1, limit = 10, statut = "" } = {}) => {
  try {
    const res = await api.get("/hospitalisations", { params: { page, limit, statut } });
    const data = Array.isArray(res.data) ? { rows: res.data, count: res.data.length, page, limit } : res.data;
    console.log("📥 Hospitalisations reçues :", data);
    return data;
  } catch (err) {
    console.error("❌ Erreur getHospitalisations :", err);
    throw err;
  }
};

export const createHospitalisation = async (payload) => api.post("/hospitalisations", payload).then(r => r.data);
export const updateHospitalisation = async (id, payload) => api.put(`/hospitalisations/${id}`, payload).then(r => r.data);
export const deleteHospitalisation = async (id) => api.delete(`/hospitalisations/${id}`).then(r => r.data);
export const changerStatutHospitalisation = async (id, payload) => api.put(`/hospitalisations/${id}/statut`, payload).then(r => r.data);
export const getHospitalisationDashboard = async () => api.get("/hospitalisations/dashboard/stats").then(r => r.data);
