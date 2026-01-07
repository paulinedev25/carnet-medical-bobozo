import { useState, useEffect } from "react";
import {
  getSoinsInfirmiers,
  createSoinInfirmier,
  updateSoinInfirmier,
  deleteSoinInfirmier,
} from "../api/soinsInfirmiers";

export function useSoinsInfirmiers(patientId) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSoins = async () => {
    if (!patientId) return;
    setLoading(true);
    try {
      const res = await getSoinsInfirmiers(patientId);
      setRows(res.data || []);
    } catch (err) {
      console.error("Erreur chargement soins infirmiers", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const add = async (payload) => {
    await createSoinInfirmier(payload);
    await fetchSoins();
  };

  const edit = async (id, payload) => {
    await updateSoinInfirmier(id, payload);
    await fetchSoins();
  };

  const remove = async (id) => {
    await deleteSoinInfirmier(id);
    await fetchSoins();
  };

  useEffect(() => {
    fetchSoins();
  }, [patientId]);

  return {
    rows,
    loading,
    add,
    edit,
    remove,
    reload: fetchSoins,
  };
}
