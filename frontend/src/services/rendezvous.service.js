import api from "./api";

export const getRendezVousByPatient = (patientId) =>
  api.get(`/rendez-vous/patient/${patientId}`);

export const createRdv = (data) => api.post("/rendez-vous", data);
export const updateRdv = (id, data) => api.put(`/rendez-vous/${id}`, data);
export const deleteRdv = (id) => api.delete(`/rendez-vous/${id}`);
