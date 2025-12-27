// src/api/auth.js
import api from "../../services/api";

/**
 * 🔐 Login
 * @param {string} email
 * @param {string} mot_de_passe
 * @returns {Promise<{ token: string, utilisateur: object }>}
 */
export async function login(email, mot_de_passe) {
  const response = await api.post("/auth/login", {
    email,          // correspond exactement au backend
    mot_de_passe,   // correspond exactement au backend
  });

  const { token, utilisateur } = response.data;

  if (token && utilisateur) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(utilisateur));
  }

  return response.data;
}

/**
 * 🚪 Logout
 */
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}

/**
 * 👤 Récupérer l'utilisateur courant depuis le localStorage
 */
export function getCurrentUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}
