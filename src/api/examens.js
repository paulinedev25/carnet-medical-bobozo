// src/api/examens.js
import api from "../services/api";

/**
 * 📌 Helper pour logguer les erreurs sans casser l’UI
 */
const handleApiError = (context, error) => {
  const status = error.response?.status;
  const message = error.response?.data?.error || error.message;

  // Ignorer silencieusement le 304
  if (status === 304) {
    console.debug(`ℹ️ [${context}] 304 Not Modified → données déjà à jour`);
    return { status: 304 };
  }

  console.error(`❌ [${context}] (${status ?? "?"}) →`, message);
  return { error: message, status };
};

/**
 * 📋 Récupérer les examens (avec filtres)
 */
export const getExamens = async (params = {}) => {
  try {
    console.log("📥 GET /examens →", params);
    const res = await api.get("/examens", { params });

    // Normalisation
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
 * 🩺 Créer un nouvel examen
 */
export const createExamen = async (payload) => {
  try {
    if (!payload?.consultation_id || !payload?.type_examen) {
      throw new Error("consultation_id et type_examen sont requis");
    }
    console.log("📤 POST /examens →", payload);
    const res = await api.post("/examens", payload);
    return res.data;
  } catch (error) {
    return handleApiError("createExamen", error);
  }
};

/**
 * ✏️ Modifier un examen
 */
export const updateExamen = async (id, payload) => {
  try {
    if (!id) throw new Error("ID examen manquant");
    console.log(`✏️ PUT /examens/${id} →`, payload);
    const res = await api.put(`/examens/${id}`, payload);
    return res.data;
  } catch (error) {
    return handleApiError("updateExamen", error);
  }
};

/**
 * 🗑️ Supprimer un examen
 */
export const deleteExamen = async (id) => {
  try {
    if (!id) throw new Error("ID examen manquant");
    console.log(`🗑️ DELETE /examens/${id}`);
    const res = await api.delete(`/examens/${id}`);
    return res.data;
  } catch (error) {
    return handleApiError("deleteExamen", error);
  }
};

/**
 * 🔬 Laborantin : saisir/remplacer les résultats
 */
export const updateResultat = async (id, { parametres }) => {
  try {
    if (!id) throw new Error("ID examen manquant");
    console.log(`📤 POST /examens/${id}/resultats →`, parametres);
    const res = await api.post(`/examens/${id}/resultats`, { parametres });
    return res.data;
  } catch (error) {
    return handleApiError("updateResultat", error);
  }
};

/**
 * ✏️ Modifier un résultat unique
 */
export const updateResultatUnique = async (id, payload) => {
  try {
    if (!id) throw new Error("ID résultat manquant");
    console.log(`✏️ PUT /examens/resultats/${id} →`, payload);
    const res = await api.put(`/examens/resultats/${id}`, payload);
    return res.data;
  } catch (error) {
    return handleApiError("updateResultatUnique", error);
  }
};

/**
 * 🧑‍⚕️ Médecin : interpréter l’examen
 */
export const interpretExamen = async (id, observations = "") => {
  try {
    if (!id) throw new Error("ID examen manquant");
    console.log(`🧾 PUT /examens/${id}/interpreter →`, observations);
    const res = await api.put(`/examens/${id}/interpreter`, { observations });
    return res.data;
  } catch (error) {
    return handleApiError("interpretExamen", error);
  }
};

/**
 * 📄 Télécharger le PDF d’un examen
 */
export const downloadExamenPDF = async (id) => {
  try {
    if (!id) throw new Error("ID examen manquant");
    console.log(`📄 GET /examens/${id}/pdf`);
    const res = await api.get(`/examens/${id}/pdf`, {
      responseType: "blob",
    });
    return res.data;
  } catch (error) {
    return handleApiError("downloadExamenPDF", error);
  }
};
