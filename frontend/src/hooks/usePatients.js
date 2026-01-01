// src/hooks/usePatients.js
import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import {
  getPatients,
  createPatient,
  updatePatient,
  deletePatient,
} from "../api/patients";

export const usePatients = () => {
  const { token, user } = useAuth();

  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const canWrite = ["admin", "receptionniste"].includes((user?.role || "").toLowerCase());

  // 🔄 Chargement des patients
  const load = async (opts = {}) => {
    setLoading(true);
    try {
      const data = await getPatients(token, { page, limit, search, ...opts });
      console.log("DEBUG data getPatients:", data); // 🔹 Pour vérifier

      if (data?.patients) {
        setRows(data.patients);
        setCount(data.total || data.patients.length);
        setPage(data.page || page);
        setLimit(data.limit || limit);
      } else {
        setRows([]);
        setCount(0);
      }
    } catch (err) {
      console.error("Erreur chargement patients", err);
      setRows([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Création patient
  const add = async (payload) => {
    const created = await createPatient(token, payload);
    await load(); // recharge la liste
    return created?.patient || created;
  };

  // 🔹 Mise à jour patient
  const edit = async (id, payload) => {
    const updated = await updatePatient(token, id, payload);
    await load();
    return updated?.patient || updated;
  };

  // 🔹 Suppression patient
  const remove = async (id) => {
    await deletePatient(token, id);
    await load();
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search]);

  return {
    rows,
    count,
    page,
    limit,
    search,
    loading,
    canWrite,
    setPage,
    setLimit,
    setSearch,
    add,
    edit,
    remove,
    reload: load,
  };
};
