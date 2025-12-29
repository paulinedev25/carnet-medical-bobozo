import axios from "axios";

const API_URL = "https://carnet-medical-bobozo-1.onrender.com/api/utilisateurs";

// ✅ Récupérer tous les utilisateurs
export const getUsers = async (token) => {
  try {
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; // normalement c'est un tableau d'utilisateurs
  } catch (err) {
    console.error("getUsers error:", err);
    throw err.response?.data || { error: "Impossible de charger les utilisateurs" };
  }
};

// ✅ Créer un utilisateur
export const createUser = async (userData, photoFile) => {
  try {
    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      if (userData[key] !== undefined && userData[key] !== null) {
        formData.append(key, userData[key]);
      }
    });
    if (photoFile) formData.append("photo", photoFile);

    const res = await axios.post(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("createUser error:", err);
    throw err.response?.data || { error: "Erreur lors de la création de l'utilisateur" };
  }
};

// ✅ Mettre à jour un utilisateur
export const updateUser = async (id, userData, photoFile) => {
  try {
    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      if (userData[key] !== undefined && userData[key] !== null) {
        formData.append(key, userData[key]);
      }
    });
    if (photoFile) formData.append("photo", photoFile);

    const res = await axios.put(`${API_URL}/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("updateUser error:", err);
    throw err.response?.data || { error: "Erreur lors de la mise à jour de l'utilisateur" };
  }
};

// ✅ Supprimer un utilisateur
export const deleteUser = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.error("deleteUser error:", err);
    throw err.response?.data || { error: "Erreur lors de la suppression de l'utilisateur" };
  }
};

// ✅ Réinitialiser le mot de passe
export const resetPassword = async (id, newPassword) => {
  try {
    const res = await axios.put(`${API_URL}/${id}/reset-password`, { mot_de_passe: newPassword });
    return res.data;
  } catch (err) {
    console.error("resetPassword error:", err);
    throw err.response?.data || { error: "Erreur lors de la réinitialisation du mot de passe" };
  }
};


/**
 * 🔹 Récupérer uniquement les médecins (role ou fonction)
 */
export const getMedecins = async () => {
  try {
    const res = await api.get("/utilisateurs");
    console.log("getMedecins response:", res);
    const data = Array.isArray(res.data) ? res.data : [];
    return data.filter((u) => {
      const role = (u.role || "").toLowerCase();
      const fonction = (u.fonction || "").toLowerCase();
      return role === "medecin" || fonction.includes("médecin");
    });
  } catch (err) {
    console.error("getMedecins error:", err.response?.data || err);
    throw err.response?.data || { error: "Impossible de charger les médecins" };
  }
};
