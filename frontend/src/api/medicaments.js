import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getMedicaments = async (token) => {
  const res = await axios.get(`${API_URL}/medicaments`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createMedicament = async (token, payload) => {
  const res = await axios.post(`${API_URL}/medicaments`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateMedicament = async (token, id, payload) => {
  const res = await axios.put(`${API_URL}/medicaments/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteMedicament = async (token, id) => {
  const res = await axios.delete(`${API_URL}/medicaments/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
