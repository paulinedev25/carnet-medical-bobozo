import axios from "axios";

const API_URL = "http://localhost:5000/api/utilisateurs"; // ✅ route backend

// 🔹 Lire tous les utilisateurs (admin)
export async function getUsers(token) {
  try {
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error("getUsers error:", err.response?.data || err);
    throw err.response?.data || { error: "Impossible de charger les utilisateurs" };
  }
}

// 🔹 Créer un utilisateur (admin) avec photo
export async function createUser(token, userData, file) {
  try {
    const formData = new FormData();
    for (const key in userData) {
      if (key !== "id" && key !== "date_creation") {
        formData.append(key, userData[key] ?? "");
      }
    }
    if (file) formData.append("photo", file);

    const res = await axios.post(API_URL, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (err) {
    console.error("createUser error:", err.response?.data || err);
    throw err.response?.data || { error: "Erreur lors de la création de l'utilisateur" };
  }
}

// 🔹 Mettre à jour un utilisateur (admin) avec photo
export async function updateUser(token, userId, userData, file) {
  try {
    const formData = new FormData();

    for (const key in userData) {
      if (
        key !== "id" &&
        key !== "date_creation" &&
        userData[key] !== "" &&
        userData[key] !== null &&
        userData[key] !== undefined
      ) {
        formData.append(key, userData[key]);
      }
    }

    if (file) formData.append("photo", file);

    const res = await axios.put(`${API_URL}/${userId}`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (err) {
    console.error("updateUser error:", err.response?.data || err);
    throw err.response?.data || { error: "Erreur lors de la mise à jour de l'utilisateur" };
  }
}

// 🔹 Supprimer un utilisateur (admin)
export async function deleteUser(token, userId) {
  try {
    const res = await axios.delete(`${API_URL}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("deleteUser error:", err.response?.data || err);
    throw err.response?.data || { error: "Erreur lors de la suppression de l'utilisateur" };
  }
}

// 🔹 Reset mot de passe (admin)
export async function resetPassword(token, userId, newPassword) {
  try {
    const res = await axios.put(
      `${API_URL}/${userId}/password`,
      { mot_de_passe: newPassword }, // ⚠️ doit correspondre au backend
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (err) {
    console.error("resetPassword error:", err.response?.data || err);
    throw err.response?.data || { error: "Erreur lors du reset du mot de passe" };
  }
}

// 🔹 Récupérer uniquement les médecins (role ou fonction)
export async function getMedecins(token) {
  try {
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = Array.isArray(res.data) ? res.data : [];

    // 🔥 Inclure les rôles "medecin" ET les fonctions contenant "médecin"
    return data.filter((u) => {
      const role = (u.role || "").toLowerCase();
      const fonction = (u.fonction || "").toLowerCase();
      return role === "medecin" || fonction.includes("médecin");
    });
  } catch (err) {
    console.error("getMedecins error:", err.response?.data || err);
    throw err.response?.data || { error: "Impossible de charger les médecins" };
  }
}
