// src/services/api.js
import axios from "axios";

// 🔧 Création de l'instance Axios
const api = axios.create({
  // ✅ Base URL adaptée pour Vite + Render
  // /api est obligatoire car ton backend expose toutes les routes sous /api
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// 🔐 Ajouter automatiquement le token JWT si présent
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 Gestion globale des erreurs auth
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⛔ Session expirée ou non autorisée");
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
