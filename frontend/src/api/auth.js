import api from "../services/api";

// 🔐 Login
export async function login(email, mot_de_passe) {
  const response = await api.post("/auth/login", {
    email,
    mot_de_passe,
  });

  const { token, utilisateur } = response.data;

  if (token && utilisateur) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(utilisateur)); // ✅ aligné AuthContext
  }

  return response.data;
}

// 🚪 Logout
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}

// 👤 Utilisateur courant
export function getCurrentUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}
