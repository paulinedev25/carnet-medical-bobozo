import api from "./api"; // ton instance Axios

export const getSoinsInfirmiers = async (patientId) => {
  return api.get(`/soins-infirmiers/patient/${patientId}`);
};

export const createSoinInfirmier = async (payload) => {
  return api.post("/soins-infirmiers", payload);
};

export const updateSoinInfirmier = async (id, payload) => {
  return api.put(`/soins-infirmiers/${id}`, payload);
};

export const deleteSoinInfirmier = async (id) => {
  return api.delete(`/soins-infirmiers/${id}`);
};
