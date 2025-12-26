import api from "./services/api";

// 🔐 Login avec email + mot_de_passe
export async function login(email, mot_de_passe) {
  const response = await api.post("/auth/login", {
    email,
    mot_de_passe,
  });

  const { token, utilisateur } = response.data;

  // ✅ Stockage JWT
  if (token) {
    localStorage.setItem("token", token);
    localStorage.setItem("utilisateur", JSON.stringify(utilisateur));
  }

  return response.data;
}

// 🚪 Logout
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("utilisateur");
  window.location.href = "/login";
}

// 👤 Utilisateur courant
export function getCurrentUser() {
  const user = localStorage.getItem("utilisateur");
  return user ? JSON.parse(user) : null;
}
