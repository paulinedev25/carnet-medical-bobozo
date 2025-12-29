// src/pages/admin/PrescriptionsPage.jsx
import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../auth/AuthContext";
import {
  getPrescriptions,
  createPrescription,
  updatePrescription,
  deletePrescription,
  deliverPrescription,
} from "../../api/prescriptions";
import { getMedicaments } from "../../api/medicaments";
import { getConsultations } from "../../api/consultations";

import PrescriptionModal from "../../components/prescriptions/PrescriptionModal";
import DeliverModal from "../../components/prescriptions/DeliverModal";
import { printOrdonnancePDF } from "../../components/prescriptions/PrintOrdonnance";

export default function PrescriptionsPage() {
  const { token, user } = useAuth();

  const [prescriptions, setPrescriptions] = useState([]);
  const [medicaments, setMedicaments] = useState([]);
  const [consultations, setConsultations] = useState([]);

  const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);
  const [loadingMedicaments, setLoadingMedicaments] = useState(false);
  const [loadingConsultations, setLoadingConsultations] = useState(false);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [openPrescriptionModal, setOpenPrescriptionModal] = useState(false);
  const [openDeliverModal, setOpenDeliverModal] = useState(false);
  const [selected, setSelected] = useState(null);

  // ---------- helpers ----------
  const normalizeRows = (res) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.rows)) return res.rows;
    if (Array.isArray(res.consultations)) return res.consultations;
    if (Array.isArray(res.data)) return res.data;
    return [];
  };

  // ---------- chargement prescriptions ----------
  const loadPrescriptions = useCallback(
    async (opts = {}) => {
      if (!token) return;
      setLoadingPrescriptions(true);
      try {
        const res = await getPrescriptions(token, opts);
        console.log("API prescriptions raw response:", res);
        setPrescriptions(normalizeRows(res));
      } catch (err) {
        console.error("Erreur chargement prescriptions", err);
        const serverMsg = err?.response?.data?.message || err.message || "Erreur inconnue serveur";
        toast.error(`❌ Impossible de charger les prescriptions: ${serverMsg}`);
      } finally {
        setLoadingPrescriptions(false);
      }
    },
    [token]
  );

  // ---------- chargement médicaments ----------
  const loadMedicaments = useCallback(async () => {
    if (!token) return;
    setLoadingMedicaments(true);
    try {
      const res = await getMedicaments(token);
      console.debug("Medicaments API:", res);
      setMedicaments(normalizeRows(res));
    } catch (err) {
      console.error("Erreur chargement médicaments", err);
      toast.error(err?.response?.data?.message || "❌ Impossible de charger les médicaments");
    } finally {
      setLoadingMedicaments(false);
    }
  }, [token]);

  // ---------- chargement consultations ----------
  const loadConsultations = useCallback(async () => {
    if (!token || user?.role === "pharmacien") return;
    setLoadingConsultations(true);
    try {
      const res = await getConsultations(token);
      console.debug("Consultations API:", res);
      setConsultations(normalizeRows(res));
    } catch (err) {
      console.error("Erreur chargement consultations", err);
      if (user?.role !== "pharmacien") {
        toast.error(err?.response?.data?.message || "❌ Impossible de charger les consultations");
      }
    } finally {
      setLoadingConsultations(false);
    }
  }, [token, user]);

  // Initial load
  useEffect(() => {
    if (!token) return;
    loadPrescriptions();
    loadMedicaments();
    loadConsultations();
  }, [token, loadPrescriptions, loadMedicaments, loadConsultations]);

  // ---------- recherche ----------
  const safeToLower = (v) => (typeof v === "string" ? v.toLowerCase() : "");
  const filtered = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    if (!q) return prescriptions;
    return prescriptions.filter((p) => {
      const patient = p.consultation?.patient || {};
      const medName =
        p.medicament?.nom_commercial || p.medicament?.nom || p.medicament_nom || "";
      return (
        safeToLower(medName).includes(q) ||
        safeToLower(patient.nom).includes(q) ||
        safeToLower(patient.prenom).includes(q)
      );
    });
  }, [prescriptions, search]);

  // ---------- CRUD ----------
  const handleSave = async (action, idOrPayload, payload) => {
    if (!token) {
      toast.error("Non authentifié");
      return;
    }
    setSaving(true);
    try {
      let res;
      if (action === "create") res = await createPrescription(token, idOrPayload);
      else if (action === "update") res = await updatePrescription(token, idOrPayload, payload);

      if (res?.message) toast.success(res.message);

      setOpenPrescriptionModal(false);
      setSelected(null);
      await loadPrescriptions();

      if (res?.rupture && res.prescription) {
        toast.warning("⚠️ Médicament en rupture");
        printOrdonnancePDF(res.prescription);
      }
    } catch (err) {
      console.error(`Erreur ${action} prescription`, err);
      toast.error(err?.response?.data?.message || `❌ Erreur ${action} prescription`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Voulez-vous supprimer cette prescription ?")) return;
    if (!token) return toast.error("Non authentifié");

    setSaving(true);
    try {
      await deletePrescription(token, id);
      toast.success("🗑️ Prescription supprimée");
      await loadPrescriptions();
    } catch (err) {
      console.error("Erreur suppression prescription", err);
      toast.error(err?.response?.data?.message || "❌ Erreur suppression");
    } finally {
      setSaving(false);
    }
  };

  const handleDeliver = async (payload) => {
    if (!selected) return toast.error("⚠️ Aucune prescription sélectionnée");
    if (!token) return toast.error("Non authentifié");

    setSaving(true);
    try {
      const res = await deliverPrescription(token, selected.id, payload);
      toast.success(res?.message || "💊 Prescription délivrée");
      setOpenDeliverModal(false);
      setSelected(null);
      await loadPrescriptions();
      await loadMedicaments(); // ⚡️ mise à jour stock après livraison
    } catch (err) {
      console.error("Erreur délivrance:", err);
      const data = err?.response?.data;
      if (data?.rupture) {
        toast.error(data.message || "⚠️ Stock insuffisant");
        if (window.confirm("Le produit est en rupture. Imprimer l'ordonnance ?")) {
          printOrdonnancePDF(selected);
        }
      } else {
        toast.error(data?.message || "❌ Erreur délivrance");
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = (prescription) => {
    try {
      printOrdonnancePDF(prescription);
      toast.success("Ordonnance (PDF) générée");
    } catch (err) {
      console.error("Erreur impression ordonnance", err);
      toast.error("❌ Impossible de générer l'ordonnance");
    }
  };

  // ---------- UI ----------
  if (!token) {
    return (
      <div className="p-6">
        <p className="text-red-500">
          Vous devez être authentifié pour accéder à cette page.
        </p>
      </div>
    );
  }

  const isLoading = loadingPrescriptions || loadingMedicaments || loadingConsultations;

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h1 className="text-xl font-semibold">💊 Prescriptions</h1>
        <div className="flex gap-2 items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Rechercher (patient / médicament)"
            className="border rounded px-3 py-2"
          />
          {user?.role === "medecin" && (
            <button
              disabled={saving}
              onClick={() => {
                setSelected(null);
                setOpenPrescriptionModal(true);
              }}
              className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              + Prescrire
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        {isLoading ? (
          <div className="py-6 text-center text-gray-500">⏳ Chargement...</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Patient</th>
                <th className="px-4 py-2 text-left">Médicament</th>
                <th className="px-4 py-2 text-left">Posologie</th>
                <th className="px-4 py-2 text-left">Durée</th>
                <th className="px-4 py-2 text-left">Statut</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((p, idx) => (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">
                      {p.consultation?.patient
                        ? `${p.consultation.patient.nom} ${p.consultation.patient.prenom || ""}`
                        : "-"}
                    </td>
                    <td className="px-4 py-2">
                      {p.medicament
                        ? `${p.medicament.nom_commercial || p.medicament.nom || p.medicament_nom} ${p.medicament.unite || p.unite || ""}`
                        : "-"}
                    </td>

                    <td className="px-4 py-2">{p.posologie}</td>
                    <td className="px-4 py-2">{p.duree}</td>
                    <td className="px-4 py-2">{p.statut}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => handlePrint(p)}
                        className="px-2 py-1 rounded border hover:bg-gray-100"
                      >
                        📄
                      </button>
                      {user?.role === "pharmacien" && (
                        <button
                          onClick={() => {
                            setSelected(p);
                            setOpenDeliverModal(true);
                          }}
                          className="px-2 py-1 rounded border hover:bg-green-100"
                        >
                          💊
                        </button>
                      )}
                      {user?.role === "medecin" && (
                        <button
                          onClick={() => {
                            setSelected(p);
                            setOpenPrescriptionModal(true);
                          }}
                          className="px-2 py-1 rounded border hover:bg-yellow-100"
                        >
                          ✏️
                        </button>
                      )}
                      {(user?.role === "admin" || user?.role === "medecin") && (
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="px-2 py-1 rounded border hover:bg-red-100"
                        >
                          🗑️
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-gray-500">
                    Aucune prescription
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODALES */}
      <PrescriptionModal
        open={openPrescriptionModal}
        onClose={() => {
          setOpenPrescriptionModal(false);
          setSelected(null);
        }}
        onSave={(payload) =>
          selected ? handleSave("update", selected.id, payload) : handleSave("create", payload)
        }
        medicaments={medicaments}
        consultations={consultations}
        prescription={selected}
      />
      <DeliverModal
        open={openDeliverModal}
        onClose={() => {
          setOpenDeliverModal(false);
          setSelected(null);
        }}
        onDeliver={handleDeliver}
        prescription={selected}
        medicaments={medicaments} // ⚡️ passer la liste complète pour stock réel
      />
    </div>
  );
}
