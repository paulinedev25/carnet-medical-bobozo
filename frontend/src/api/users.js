// src/api/users.js
import api from "../services/api";

const USERS_URL = "/utilisateurs";

/* ===========================
   UTILISATEURS
=========================== */

// ✅ Récupérer tous les utilisateurs
export const getUsers = async () => {
  try {
    const res = await api.get(USERS_URL);
    return res.data;
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
      if (userData[key] !== undefined && userData[key] !== null && userData[key] !== "") {
        formData.append(key, userData[key]);
      }
    });
    if (photoFile) formData.append("photo", photoFile);

    const res = await api.post(USERS_URL, formData, {
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
    const userId = Number(id);
    if (isNaN(userId)) throw { message: "ID utilisateur invalide (frontend)" };

    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      if (key !== "id" && userData[key] !== undefined && userData[key] !== null && userData[key] !== "") {
        formData.append(key, userData[key]);
      }
    });
    if (photoFile) formData.append("photo", photoFile);

    const res = await api.put(`${USERS_URL}/${userId}`, formData, {
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
    const userId = Number(id);
    if (isNaN(userId)) throw { message: "ID utilisateur invalide (frontend)" };

    const res = await api.delete(`${USERS_URL}/${userId}`);
    return res.data;
  } catch (err) {
    console.error("deleteUser error:", err);
    throw err.response?.data || { error: "Erreur lors de la suppression de l'utilisateur" };
  }
};

// ✅ Réinitialiser le mot de passe
export const resetPassword = async (id, newPassword) => {
  try {
    const userId = Number(id);
    if (isNaN(userId)) throw { message: "ID utilisateur invalide (frontend)" };

    const res = await api.put(`${USERS_URL}/${userId}/reset-password`, {
      mot_de_passe: newPassword,
    });

    return res.data;
  } catch (err) {
    console.error("resetPassword error:", err);
    throw err.response?.data || { error: "Erreur lors de la réinitialisation du mot de passe" };
  }
};

/* ===========================
   MÉDECINS
=========================== */

// ✅ Récupérer uniquement les médecins
export const getMedecins = async () => {
  try {
    const res = await api.get(USERS_URL);
    const data = Array.isArray(res.data) ? res.data : [];

    return data.filter((u) => {
      const role = (u.role || "").toLowerCase();
      const fonction = (u.fonction || "").toLowerCase();
      return role === "medecin" || fonction.includes("médecin");
    });
  } catch (err) {
    console.error("getMedecins error:", err);
    throw err.response?.data || { error: "Impossible de charger les médecins" };
  }
};
