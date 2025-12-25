// src/api/hospitalisations.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/hospitalisations";

// 📋 Lire hospitalisations
export async function getHospitalisations(token, { page = 1, limit = 10, statut = "" } = {}) {
  const res = await axios.get(API_URL, {
    params: { page, limit, statut },
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log("📥 Hospitalisations reçues depuis API:", res.data);

  // Cas 1 : tableau simple
  if (Array.isArray(res.data)) {
    return { rows: res.data, count: res.data.length, page, limit };
  }

  // Cas 2 : objet paginé { rows, count, page, limit }
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

// ➕ Créer hospitalisation
export async function createHospitalisation(token, payload) {
  console.log("📤 POST /hospitalisations →", payload);
  const res = await axios.post(API_URL, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("✅ Réponse création hospitalisation:", res.data);
  return res.data;
}

// ✏️ Mise à jour hospitalisation
export async function updateHospitalisation(token, id, payload) {
  console.log(`✏️ PUT /hospitalisations/${id} →`, payload);
  const res = await axios.put(`${API_URL}/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("✅ Réponse mise à jour:", res.data);
  return res.data;
}

// 🗑️ Supprimer hospitalisation
export async function deleteHospitalisation(token, id) {
  console.log(`🗑️ DELETE /hospitalisations/${id}`);
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("✅ Réponse suppression:", res.data);
  return res.data;
}
