import axios from "axios";

const API_URL = "http://localhost:5000/api"; // ⚠️ adapte l'URL à ton backend

// Login avec email + mot_de_passe
export async function login(email, mot_de_passe) {
  const res = await axios.post(`${API_URL}/auth/login`, { email, mot_de_passe });
  return res.data; // { message, token, utilisateur }
}
