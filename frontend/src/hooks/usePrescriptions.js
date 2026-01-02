// src/hooks/usePrescriptions.js
import { useState, useEffect, useCallback } from "react";
import {
  getPrescriptions,
  createPrescription,
  updatePrescription,
  deletePrescription,
  deliverPrescription,
  getPrescriptionsByConsultation,
  getPrescriptionDashboard,
} from "../api/prescriptions";

/**
 * 📌 Hook React pour gérer prescriptions (CRUD + filtres + dashboard)
 */
export function usePrescriptions() {
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statut, setStatut] = useState("");
  const [consultationId, setConsultationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dashboard, setDashboard] = useState(null);

  /**
   * 🚀 Charger les prescriptions
   */
  const fetchPrescriptions = useCallback(
    async (opts = {}) => {
      setLoading(true);
      try {
        const data = await getPrescriptions({
          page: opts.page ?? page,
          limit: opts.limit ?? limit,
          statut: opts.statut ?? statut,
          consultation_id: opts.consultationId ?? consultationId,
        });

        // Normalisation
        const list = Array.isArray(data) ? data : Array.isArray(data.rows) ? data.rows : [];
        setRows(list);
        setCount(Number(data.count) || list.length);
      } catch (err) {
        console.error("❌ usePrescriptions.fetchPrescriptions error:", err);
        setRows([]);
        setCount(0);
      } finally {
        setLoading(false);
      }
    },
    [page, limit, statut, consultationId]
  );

  /**
   * 🧾 Créer une prescription
   */
  const add = async (payload) => {
    setSaving(true);
    try {
      const created = await createPrescription(payload);
      await fetchPrescriptions({ page: 1 });
      setPage(1);
      return created;
    } finally {
      setSaving(false);
    }
  };

  /**
   * ✏️ Modifier une prescription
   */
  const edit = async (id, payload) => {
    setSaving(true);
    try {
      const updated = await updatePrescription(id, payload);
      await fetchPrescriptions();
      return updated;
    } finally {
      setSaving(false);
    }
  };

  /**
   * 💊 Délivrer une prescription
   */
  const deliver = async (id, payload) => {
    setSaving(true);
    try {
      const res = await deliverPrescription(id, payload);
      await fetchPrescriptions();
      return res;
    } finally {
      setSaving(false);
    }
  };

  /**
   * 🗑️ Supprimer une prescription
   */
  const remove = async (id) => {
    setSaving(true);
    try {
      await deletePrescription(id);
      await fetchPrescriptions();
    } finally {
      setSaving(false);
    }
  };

  /**
   * 📋 Prescriptions par consultation
   */
  const fetchByConsultation = async (consultation_id) => {
    setConsultationId(consultation_id);
    setLoading(true);
    try {
      const data = await getPrescriptionsByConsultation(consultation_id);
      setRows(Array.isArray(data) ? data : []);
      setCount(Array.isArray(data) ? data.length : 0);
    } catch (err) {
      console.error("❌ usePrescriptions.fetchByConsultation error:", err);
      setRows([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 📊 Dashboard
   */
  const fetchDashboard = async () => {
    try {
      const data = await getPrescriptionDashboard();
      setDashboard(data);
      return data;
    } catch (err) {
      console.error("❌ usePrescriptions.fetchDashboard error:", err);
      setDashboard(null);
    }
  };

  /**
   * 🔄 Reload simple
   */
  const reload = () => fetchPrescriptions();

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  return {
    rows,
    count,
    page,
    limit,
    statut,
    consultationId,
    loading,
    saving,
    dashboard,
    setPage,
    setLimit,
    setStatut,
    setConsultationId,
    fetchDashboard,
    fetchByConsultation,
    add,
    edit,
    deliver,
    remove,
    reload,
  };
}
