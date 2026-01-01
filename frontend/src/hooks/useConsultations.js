import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import {
  getConsultations,
  createConsultation,
  updateConsultation,
  updateConsultationStatut,
} from "../api/consultations";

export const useConsultations = () => {
  const { token, user } = useAuth();

  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statut, setStatut] = useState("");
  const [loading, setLoading] = useState(true);

  // Droits selon rôle
  const role = (user?.role || "").toLowerCase();
  const canCreate = ["admin", "receptionniste"].includes(role);
  const canEdit = ["admin", "medecin", "receptionniste"].includes(role);
  const canChangeStatut = ["admin", "medecin"].includes(role);

  const load = async (opts = {}) => {
  setLoading(true);
  try {
    console.log("🔄 Chargement consultations avec filtres:", {
      page,
      limit,
      statut,
      ...opts,
    });

    const { rows, count, page: p, limit: l } = await getConsultations({
      page,
      limit,
      statut,
      ...opts,
    });

    console.log("📦 Consultations reçues:", rows);

    setRows(Array.isArray(rows) ? rows : []);
    setCount(Number(count) || 0);
    setPage(p || page);
    setLimit(l || limit);
  } catch (err) {
    console.error("❌ Erreur chargement consultations", err);
    setRows([]);
    setCount(0);
  } finally {
    setLoading(false);
  }
};

  const add = async (payload) => {
    const created = await createConsultation(token, payload);
    await load(); // 🔄 recharge automatiquement la liste après création
    return created?.consultation || created;
  };

  const edit = async (id, payload) => {
    const updated = await updateConsultation(token, id, payload);
    await load();
    return updated?.consultation || updated;
  };

  const changeStatut = async (id, newStatut) => {
    await updateConsultationStatut(token, id, newStatut);
    await load();
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, statut]);

  return {
    rows,
    count,
    page,
    limit,
    statut,
    loading,
    canCreate,
    canEdit,
    canChangeStatut,
    setPage,
    setLimit,
    setStatut,
    add,
    edit,
    changeStatut,
    reload: load,
  };
};
