// src/api/patients.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/patients";

// Liste paginée + recherche (serveur)
export async function getPatients(token, { page = 1, limit = 10, search = "" } = {}) {
  const res = await axios.get(API_URL, {
    params: { page, limit, search },
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = res.data;

  // ✅ cohérent avec patient.controller.js
  return {
    rows: data.patients || [],
    count: Number(data.total) || (data.patients ? data.patients.length : 0),
    page: Number(data.page) || page,
    limit: Number(data.limit) || limit,
  };
}

export async function getPatientById(token, id) {
  const res = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function createPatient(token, payload) {
  const res = await axios.post(API_URL, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // { message, patient }
}

export async function updatePatient(token, id, payload) {
  const res = await axios.put(`${API_URL}/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // { message, patient }
}

export async function deletePatient(token, id) {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
