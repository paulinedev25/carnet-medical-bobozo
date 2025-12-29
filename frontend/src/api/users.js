import api from "../services/api";

/**
 * 🔹 Lire tous les utilisateurs (admin)
 */
export const getUsers = async () => {
  try {
    const res = await api.get("/utilisateurs");
    console.log("getUsers response:", res); // 🔍 log complet
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error("getUsers error:", err.response?.data || err);
    throw err.response?.data || { error: "Impossible de charger les utilisateurs" };
  }
};

/**
 * 🔹 Créer un utilisateur (admin) avec photo
 */
export const createUser = async (userData, file) => {
  try {
    const formData = new FormData();
    for (const key in userData) {
      if (key !== "id" && key !== "date_creation" && userData[key] != null && userData[key] !== "") {
        formData.append(key, userData[key]);
      }
    }
    if (file) formData.append("photo", file);

    console.log("createUser FormData entries:");
    for (let pair of formData.entries()) console.log(pair[0], pair[1]); // 🔍 log FormData

    const res = await api.post("/utilisateurs", formData, {
      headers: { "Content-Type": "multipart/form-data" }, // ✅ assure FormData
    });

    console.log("createUser response:", res); // 🔍 log complet
    return res.data;
  } catch (err) {
    console.error("createUser error:", err.response?.data || err);
    throw err.response?.data || { error: "Erreur lors de la création de l'utilisateur" };
  }
};

/**
 * 🔹 Mettre à jour un utilisateur (admin) avec photo
 */
export const updateUser = async (userId, userData, file) => {
  try {
    const id = parseInt(userId, 10);
    if (isNaN(id)) throw { error: "ID utilisateur invalide" };

    const formData = new FormData();
    for (const key in userData) {
      if (key !== "id" && key !== "date_creation" && userData[key] !== "" && userData[key] != null) {
        formData.append(key, userData[key]);
      }
    }
    if (file) formData.append("photo", file);

    console.log("updateUser FormData entries for ID", id);
    for (let pair of formData.entries()) console.log(pair[0], pair[1]); // 🔍 log FormData

    const res = await api.put(`/utilisateurs/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("updateUser response:", res); // 🔍 log complet
    return res.data;
  } catch (err) {
    console.error("updateUser error:", err.response?.data || err);
    throw err.response?.data || { error: "Erreur lors de la mise à jour de l'utilisateur" };
  }
};

/**
 * 🔹 Supprimer un utilisateur (admin)
 */
export const deleteUser = async (userId) => {
  try {
    const id = parseInt(userId, 10);
    if (isNaN(id)) throw { error: "ID utilisateur invalide" };

    const res = await api.delete(`/utilisateurs/${id}`);
    console.log("deleteUser response:", res);
    return res.data;
  } catch (err) {
    console.error("deleteUser error:", err.response?.data || err);
    throw err.response?.data || { error: "Erreur lors de la suppression de l'utilisateur" };
  }
};

/**
 * 🔹 Reset mot de passe (admin)
 */
export const resetPassword = async (userId, newPassword) => {
  try {
    const id = parseInt(userId, 10);
    if (isNaN(id)) throw { error: "ID utilisateur invalide" };

    const res = await api.put(`/utilisateurs/${id}/password`, { mot_de_passe: newPassword });
    console.log("resetPassword response:", res);
    return res.data;
  } catch (err) {
    console.error("resetPassword error:", err.response?.data || err);
    throw err.response?.data || { error: "Erreur lors du reset du mot de passe" };
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
