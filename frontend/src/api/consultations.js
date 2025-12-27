// src/api/consultations.js
import api from "../../services/api";

/**
 * 📋 Lire consultations
 */
export async function getConsultations({ page = 1, limit = 10, statut = "" } = {}) {
  const res = await api.get("/consultations", {
    params: { page, limit, statut },
  });

  console.log("📥 Consultations reçues depuis API:", res.data);

  // Cas 1 : le backend renvoie un simple tableau
  if (Array.isArray(res.data)) {
    return { rows: res.data, count: res.data.length, page, limit };
  }

  // Cas 2 : le backend renvoie un objet paginé
  if (res.data?.rows) {
    return {
      rows: res.data.rows,
      count: res.data.count ?? res.data.rows.length,
      page: res.data.page ?? page,
      limit: res.data.limit ?? limit,
    };
  }

  console.warn("⚠️ Réponse inattendue du backend:", res.data);
  return { rows: [], count: 0, page, limit };
}

/**
 * ➕ Créer consultation
 */
export async function createConsultation(payload) {
  console.log("📤 POST /consultations →", payload);
  const res = await api.post("/consultations", payload);
  console.log("✅ Réponse création consultation:", res.data);
  return res.data;
}

/**
 * ✏️ Mise à jour consultation
 */
export async function updateConsultation(id, payload) {
  console.log(`✏️ PUT /consultations/${id} →`, payload);
  const res = await api.put(`/consultations/${id}`, payload);
  console.log("✅ Réponse mise à jour:", res.data);
  return res.data;
}

/**
 * 🔄 Changer statut
 */
export async function updateConsultationStatut(id, statut) {
  console.log(`🔄 PUT /consultations/${id}/statut →`, statut);
  const res = await api.put(`/consultations/${id}/statut`, { statut });
  console.log("✅ Réponse changement statut:", res.data);
  return res.data;
}
