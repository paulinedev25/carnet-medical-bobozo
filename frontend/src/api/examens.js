// src/api/examens.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * 📌 Helper pour logguer les erreurs sans casser l’UI
 */
const handleApiError = (context, error) => {
  const status = error.response?.status;
  const message = error.response?.data?.error || error.message;

  // Ignorer silencieusement le 304 (pas de nouvelles données)
  if (status === 304) {
    console.debug(`ℹ️ [${context}] 304 Not Modified → données déjà à jour`);
    return { status: 304 };
  }

  console.error(`❌ [${context}] (${status ?? "?"}) →`, message);
  return { error: message, status };
};

/**
 * 📋 Récupérer tous les examens (avec filtres)
 */
export const getExamens = async (token, params = {}) => {
  try {
    console.log("📥 GET /examens →", params);
    const res = await axios.get(`${API_URL}/examens`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });

    // ✅ Normalisation : on force toujours { rows, count }
    if (Array.isArray(res.data)) {
      return { rows: res.data, count: res.data.length };
    }
    if (res.data?.rows) {
      return { rows: res.data.rows, count: res.data.count ?? res.data.rows.length };
    }
    if (res.data?.data) {
      return { rows: res.data.data, count: res.data.count ?? res.data.data.length };
    }

    return { rows: [], count: 0 };
  } catch (error) {
    return handleApiError("getExamens", error);
  }
};

/**
 * 🩺 Créer un nouvel examen (prescription)
 */
export const createExamen = async (token, payload) => {
  try {
    if (!payload?.consultation_id || !payload?.type_examen) {
      throw new Error("consultation_id et type_examen sont requis");
    }
    console.log("📤 POST /examens →", payload);
    const res = await axios.post(`${API_URL}/examens`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    return handleApiError("createExamen", error);
  }
};

/**
 * ✏️ Modifier une prescription existante
 */
export const updateExamen = async (token, id, payload) => {
  try {
    if (!id) throw new Error("ID examen manquant");
    console.log(`✏️ PUT /examens/${id} →`, payload);
    const res = await axios.put(`${API_URL}/examens/${id}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    return handleApiError("updateExamen", error);
  }
};

/**
 * 🗑️ Supprimer un examen
 */
export const deleteExamen = async (token, id) => {
  try {
    if (!id) throw new Error("ID examen manquant");
    console.log(`🗑️ DELETE /examens/${id}`);
    const res = await axios.delete(`${API_URL}/examens/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    return handleApiError("deleteExamen", error);
  }
};

/**
 * 🔬 Laborantin : saisir ou remplacer tous les résultats
 */
export const updateResultat = async (token, id, { parametres }) => {
  try {
    if (!id) throw new Error("ID examen manquant");
    console.log(`📤 POST /examens/${id}/resultats →`, parametres);
    const res = await axios.post(
      `${API_URL}/examens/${id}/resultats`,
      { parametres },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    return handleApiError("updateResultat", error);
  }
};

/**
 * ✏️ Modifier un seul résultat (admin ou laborantin)
 */
export const updateResultatUnique = async (token, id, payload) => {
  try {
    if (!id) throw new Error("ID résultat manquant");
    console.log(`✏️ PUT /examens/resultats/${id} →`, payload);
    const res = await axios.put(`${API_URL}/examens/resultats/${id}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    return handleApiError("updateResultatUnique", error);
  }
};

/**
 * 🧑‍⚕️ Médecin : interpréter l’examen
 */
export const interpretExamen = async (token, id, observations = "") => {
  try {
    if (!id) throw new Error("ID examen manquant");
    console.log(`🧾 PUT /examens/${id}/interpreter →`, observations);
    const res = await axios.put(
      `${API_URL}/examens/${id}/interpreter`,
      { observations },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    return handleApiError("interpretExamen", error);
  }
};

/**
 * 📄 Télécharger le PDF d’un examen
 */
export const downloadExamenPDF = async (token, id) => {
  try {
    if (!id) throw new Error("ID examen manquant");
    console.log(`📄 GET /examens/${id}/pdf`);
    const res = await axios.get(`${API_URL}/examens/${id}/pdf`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });
    return res.data;
  } catch (error) {
    return handleApiError("downloadExamenPDF", error);
  }
};
