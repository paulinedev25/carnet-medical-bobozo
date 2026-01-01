import { useState, useEffect, useCallback } from "react";
import {
  getExamens,
  createExamen,
  updateExamen,
  deleteExamen,
  updateResultat,
  interpretExamen,
} from "../api/examens";
import { useAuth } from "../auth/AuthContext";

export function useExamens() {
  const { token } = useAuth();

  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statut, setStatut] = useState("");
  const [loading, setLoading] = useState(false);

  // 🚀 Charger les examens
  const fetchExamens = useCallback(async () => {
    if (!token) return; // sécurité
    setLoading(true);
    try {
      const data = await getExamens(token, { page, limit, statut });

      setRows(Array.isArray(data.rows) ? data.rows : []);
      setCount(Number(data.count) || 0);
    } catch (err) {
      console.error("❌ useExamens.fetchExamens error:", err);
      setRows([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, [token, page, limit, statut]);

  useEffect(() => {
    fetchExamens();
  }, [fetchExamens]);

  // ➕ Créer un examen
  const add = async (payload) => {
    const created = await createExamen(token, payload);
    await fetchExamens();
    return created;
  };

  // ✏️ Modifier un examen
  const edit = async (id, payload) => {
    const updated = await updateExamen(token, id, payload);
    await fetchExamens();
    return updated;
  };

  // 🗑️ Supprimer un examen
  const remove = async (id) => {
    await deleteExamen(token, id);
    await fetchExamens();
  };

  // 🔬 Laborantin : saisir/remplacer les résultats
  const saveResultat = async (id, parametres) => {
    const res = await updateResultat(token, id, { parametres });
    await fetchExamens();
    return res;
  };

  // 🧑‍⚕️ Médecin : interpréter un examen
  const interpret = async (id, observations) => {
    const res = await interpretExamen(token, id, observations);
    await fetchExamens();
    return res;
  };

  return {
    rows,
    count,
    page,
    limit,
    statut,
    loading,
    setPage,
    setLimit,
    setStatut,
    add,
    edit,
    remove,
    saveResultat,
    interpret,
    reload: fetchExamens,
  };
}
