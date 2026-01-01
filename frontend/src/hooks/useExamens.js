// src/hooks/useExamens.js
import { useState, useEffect, useCallback } from "react";
import {
  getExamens,
  createExamen,
  updateExamen,
  deleteExamen,
  updateResultat,
  interpretExamen,
  downloadExamenPDF,
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
  const fetchExamens = useCallback(async (opts = {}) => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await getExamens({
        page: opts.page ?? page,
        limit: opts.limit ?? limit,
        statut: opts.statut ?? statut,
      });

      if (response?.error) {
        console.error("❌ useExamens.fetchExamens error:", response.error);
        setRows([]);
        setCount(0);
        return;
      }

      const examens = Array.isArray(response.rows)
        ? response.rows
        : Array.isArray(response.data)
        ? response.data
        : [];

      setRows(examens);
      setCount(Number(response.count) || examens.length);
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
    if (!payload?.consultation_id || !payload?.type_examen) {
      throw new Error("consultation_id et type_examen sont requis");
    }
    const created = await createExamen(payload);
    await fetchExamens();
    return created;
  };

  // ✏️ Modifier un examen
  const edit = async (id, payload) => {
    if (!id) throw new Error("ID examen manquant");
    const updated = await updateExamen(id, payload);
    await fetchExamens();
    return updated;
  };

  // 🗑️ Supprimer un examen
  const remove = async (id) => {
    if (!id) throw new Error("ID examen manquant");
    await deleteExamen(id);
    await fetchExamens();
  };

  // 🔬 Saisir / Modifier résultats
  const saveResultat = async (id, parametres) => {
    if (!id) throw new Error("ID examen manquant");
    const res = await updateResultat(id, { parametres });
    await fetchExamens();
    return res;
  };

  // 🧑‍⚕️ Interpréter examen
  const interpret = async (id, observations = "") => {
    if (!id) throw new Error("ID examen manquant");
    const res = await interpretExamen(id, observations);
    await fetchExamens();
    return res;
  };

  // 📄 Télécharger PDF
  const downloadPDF = async (id) => {
    if (!id) throw new Error("ID examen manquant");
    const blob = await downloadExamenPDF(id);
    const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `examen-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
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
    downloadPDF,
    reload: fetchExamens,
  };
}
