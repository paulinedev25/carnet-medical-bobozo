// src/api/users.js
import api from "../services/api";

const USERS_URL = "/utilisateurs";

/* ===========================
   UTILISATEURS
=========================== */

// ✅ Récupérer tous les utilisateurs
export const getUsers = async () => {
  const res = await api.get(USERS_URL);
  return res.data;
};

// ✅ Créer un utilisateur
export const createUser = async (userData, photoFile) => {
  const formData = new FormData();

  Object.keys(userData).forEach((key) => {
    if (
      userData[key] !== undefined &&
      userData[key] !== null &&
      userData[key] !== ""
    ) {
      formData.append(key, userData[key]);
    }
  });

  if (photoFile) {
    formData.append("photo", photoFile);
  }

  const res = await api.post(USERS_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// ✅ Mettre à jour un utilisateur
export const updateUser = async (id, userData, photoFile) => {
  const userId = Number(id);
  if (isNaN(userId)) {
    throw new Error("ID utilisateur invalide");
  }

  const formData = new FormData();

  Object.keys(userData).forEach((key) => {
    if (
      key !== "id" &&
      userData[key] !== undefined &&
      userData[key] !== null &&
      userData[key] !== ""
    ) {
      formData.append(key, userData[key]);
    }
  });

  if (photoFile) {
    formData.append("photo", photoFile);
  }

  const res = await api.put(`${USERS_URL}/${userId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// ✅ Supprimer un utilisateur
export const deleteUser = async (id) => {
  const userId = Number(id);
  if (isNaN(userId)) {
    throw new Error("ID utilisateur invalide");
  }

  const res = await api.delete(`${USERS_URL}/${userId}`);
  return res.data;
};

// ✅ Réinitialiser le mot de passe
export const resetPassword = async (id, newPassword) => {
  const userId = Number(id);
  if (isNaN(userId)) {
    throw new Error("ID utilisateur invalide");
  }

  const res = await api.put(`${USERS_URL}/${userId}/reset-password`, {
    mot_de_passe: newPassword,
  });

  return res.data;
};

// ===========================
// MÉDECINS
// ===========================

// ✅ Récupérer uniquement les médecins
export const getMedecins = async () => {
  try {
    const res = await api.get("/utilisateurs");

    const data = Array.isArray(res.data) ? res.data : [];

    return data.filter((u) => {
      const role = (u.role || "").toLowerCase();
      const fonction = (u.fonction || "").toLowerCase();
      return role === "medecin" || fonction.includes("médecin");
    });
  } catch (err) {
    console.error("getMedecins error:", err);
    throw (
      err.response?.data || {
        error: "Impossible de charger les médecins",
      }
    );
  }
};
