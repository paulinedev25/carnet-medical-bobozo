// src/api/consultations.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/consultations";

// 📋 Lire consultations
export async function getConsultations(token, { page = 1, limit = 10, statut = "" } = {}) {
  const res = await axios.get(API_URL, {
    params: { page, limit, statut },
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log("📥 Consultations reçues depuis API:", res.data);

  // Cas 1 : le backend renvoie un simple tableau
  if (Array.isArray(res.data)) {
    return { rows: res.data, count: res.data.length, page, limit };
  }

  // Cas 2 : le backend renvoie un objet paginé { rows, count, page, limit }
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

// ➕ Créer consultation
export async function createConsultation(token, payload) {
  console.log("📤 POST /consultations →", payload);
  const res = await axios.post(API_URL, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("✅ Réponse création consultation:", res.data);
  return res.data;
}

// ✏️ Mise à jour consultation
export async function updateConsultation(token, id, payload) {
  console.log(`✏️ PUT /consultations/${id} →`, payload);
  const res = await axios.put(`${API_URL}/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("✅ Réponse mise à jour:", res.data);
  return res.data;
}

// 🔄 Changer statut
export async function updateConsultationStatut(token, id, statut) {
  console.log(`🔄 PUT /consultations/${id}/statut →`, statut);
  const res = await axios.put(
    `${API_URL}/${id}/statut`,
    { statut },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  console.log("✅ Réponse changement statut:", res.data);
  return res.data;
}
