import api from "./api";

export const getSoinsByHospitalisation = (hospitalisationId) =>
  api.get(`/soins-infirmiers/hospitalisation/${hospitalisationId}`);

export const createSoin = (data) => api.post("/soins-infirmiers", data);
export const updateSoin = (id, data) => api.put(`/soins-infirmiers/${id}`, data);
export const deleteSoin = (id) => api.delete(`/soins-infirmiers/${id}`);
