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

  const [rows, setRows] = useState([]);       // patients
  const [count, setCount] = useState(0);      // total
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const canWrite = ["admin", "receptionniste"].includes((user?.role || "").toLowerCase());

  const load = async (opts = {}) => {
    setLoading(true);
    try {
      const data = await getPatients(token, { page, limit, search, ...opts });

      if (data?.patients) {
        // ✅ cohérent avec ton contrôleur
        setRows(data.patients);
        setCount(data.total || data.patients.length);
        setPage(data.page || page);
        setLimit(data.limit || limit);
      } else if (data?.rows) {
        // cas Sequelize findAndCountAll classique
        setRows(data.rows);
        setCount(data.count || 0);
      } else if (Array.isArray(data)) {
        // fallback si API renvoie juste un tableau
        setRows(data);
        setCount(data.length);
      } else {
        setRows([]);
        setCount(0);
      }
    } catch (err) {
      console.error("Erreur chargement patients", err);
    } finally {
      setLoading(false);
    }
  };

  const add = async (payload) => {
    const created = await createPatient(token, payload);
    await load();
    return created?.patient || created;
  };

  const edit = async (id, payload) => {
    const updated = await updatePatient(token, id, payload);
    await load();
    return updated?.patient || updated;
  };

  const remove = async (id) => {
    await deletePatient(token, id);
    await load();
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search]);

  return {
    rows, count, page, limit, search, loading, canWrite,
    setPage, setLimit, setSearch,
    add, edit, remove, reload: load,
  };
};
