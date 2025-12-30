import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://carnet-medical-bobozo.onrender.com/api",
  headers: { "Content-Type": "application/json" },
});

// Ajouter automatiquement le token JWT si présent
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

// Gestion globale des erreurs
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
