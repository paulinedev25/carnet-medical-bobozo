// src/api/users.js
import api from "../services/api";

const USERS_URL = "/utilisateurs";

/* ===========================
   UTILISATEURS
=========================== */

export const getUsers = async () => {
  const res = await api.get(USERS_URL);
  return res.data;
};

export const createUser = async (userData, photoFile) => {
  const formData = new FormData();

  Object.entries(userData).forEach(([key, value]) => {
    if (value) formData.append(key, value);
  });

  if (photoFile) formData.append("photo", photoFile);

  const res = await api.post(USERS_URL, formData);
  return res.data;
};

export const updateUser = async (id, userData, photoFile) => {
  const userId = Number(id);
  if (isNaN(userId)) throw new Error("ID invalide");

  const formData = new FormData();
  Object.entries(userData).forEach(([key, value]) => {
    if (key !== "id" && value) formData.append(key, value);
  });

  if (photoFile) formData.append("photo", photoFile);

  const res = await api.put(`${USERS_URL}/${userId}`, formData);
  return res.data;
};

export const deleteUser = async (id) => {
  const userId = Number(id);
  if (isNaN(userId)) throw new Error("ID invalide");

  const res = await api.delete(`${USERS_URL}/${userId}`);
  return res.data;
};

export const resetPassword = async (id, newPassword) => {
  const userId = Number(id);
  if (isNaN(userId)) throw new Error("ID invalide");

  const res = await api.put(`${USERS_URL}/${userId}/reset-password`, {
    mot_de_passe: newPassword,
  });
  return res.data;
};

/* ===========================
   MÉDECINS
=========================== */

export const getMedecins = async () => {
  const res = await api.get(USERS_URL);
  return res.data.filter((u) => {
    const role = (u.role || "").toLowerCase();
    const fonction = (u.fonction || "").toLowerCase();
    return role === "medecin" || fonction.includes("médecin");
  });
};
