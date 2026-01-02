// src/hooks/useMedicaments.js
import { useState, useEffect, useCallback } from "react";
import {
  getMedicaments,
  createMedicament,
  updateMedicament,
  deleteMedicament,
  reapprovisionnerMedicament,
  getAlertesStock,
} from "../api/medicaments";
import { toast } from "react-toastify";

/**
 * 📌 Hook React pour gérer les médicaments
 */
export function useMedicaments() {
  const [medicaments, setMedicaments] = useState([]);
  const [alertes, setAlertes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // ---------- Charger tous les médicaments ----------
  const fetchMedicaments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMedicaments();
      setMedicaments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ useMedicaments.fetchMedicaments error:", err);
      toast.error(err?.response?.data?.error || "Erreur chargement médicaments");
      setMedicaments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ---------- Ajouter un médicament ----------
  const addMedicament = async (payload) => {
    setSaving(true);
    try {
      const res = await createMedicament(payload);
      toast.success(res?.message || "Médicament créé ✅");
      await fetchMedicaments();
      return res.medicament;
    } catch (err) {
      console.error("❌ useMedicaments.addMedicament error:", err);
      toast.error(err?.response?.data?.error || "Erreur création médicament");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  // ---------- Modifier un médicament ----------
  const editMedicament = async (id, payload) => {
    setSaving(true);
    try {
      const res = await updateMedicament(id, payload);
      toast.success(res?.message || "Médicament mis à jour ✅");
      await fetchMedicaments();
      return res.medicament;
    } catch (err) {
      console.error("❌ useMedicaments.editMedicament error:", err);
      toast.error(err?.response?.data?.error || "Erreur mise à jour médicament");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  // ---------- Supprimer un médicament ----------
  const removeMedicament = async (id) => {
    if (!window.confirm("⚠️ Supprimer ce médicament ?")) return;
    setSaving(true);
    try {
      const res = await deleteMedicament(id);
      toast.success(res?.message || "Médicament supprimé 🗑️");
      await fetchMedicaments();
    } catch (err) {
      console.error("❌ useMedicaments.removeMedicament error:", err);
      toast.error(err?.response?.data?.error || "Erreur suppression médicament");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  // ---------- Réapprovisionner un médicament ----------
  const replenishMedicament = async (id, quantite) => {
    setSaving(true);
    try {
      const res = await reapprovisionnerMedicament(id, quantite);
      toast.success(res?.message || "Stock réapprovisionné ✅");
      await fetchMedicaments();
      return res.medicament;
    } catch (err) {
      console.error("❌ useMedicaments.replenishMedicament error:", err);
      toast.error(err?.response?.data?.error || "Erreur réapprovisionnement");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  // ---------- Alertes stock ----------
  const fetchAlertesStock = useCallback(async () => {
    try {
      const data = await getAlertesStock();
      setAlertes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ useMedicaments.fetchAlertesStock error:", err);
      toast.error(err?.response?.data?.error || "Erreur alertes stock");
      setAlertes([]);
    }
  }, []);

  // ---------- Reload complet ----------
  const reload = async () => {
    await Promise.all([fetchMedicaments(), fetchAlertesStock()]);
  };

  // Initial load
  useEffect(() => {
    reload();
  }, [fetchMedicaments, fetchAlertesStock]);

  return {
    medicaments,
    alertes,
    loading,
    saving,
    fetchMedicaments,
    addMedicament,
    editMedicament,
    removeMedicament,
    replenishMedicament,
    fetchAlertesStock,
    reload,
  };
}
