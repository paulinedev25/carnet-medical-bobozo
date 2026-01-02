import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../auth/AuthContext";

import { usePrescriptions } from "../../hooks/usePrescriptions";
import { getMedicaments } from "../../api/medicaments";
import { getConsultations } from "../../api/consultations";

import PrescriptionModal from "../../components/prescriptions/PrescriptionModal";
import DeliverModal from "../../components/prescriptions/DeliverModal";
import { printOrdonnancePDF } from "../../components/prescriptions/PrintOrdonnance";

export default function PrescriptionsPage() {
  const { token, user } = useAuth();

  const {
    rows: prescriptions,
    loading,
    saving,
    add,
    edit,
    remove,
    deliver,
    reload,
  } = usePrescriptions();

  const [medicaments, setMedicaments] = useState([]);
  const [consultations, setConsultations] = useState([]);

  const [loadingMedicaments, setLoadingMedicaments] = useState(false);
  const [loadingConsultations, setLoadingConsultations] = useState(false);

  const [search, setSearch] = useState("");
  const [openPrescriptionModal, setOpenPrescriptionModal] = useState(false);
  const [openDeliverModal, setOpenDeliverModal] = useState(false);
  const [selected, setSelected] = useState(null);

  /* ----------------------- helpers ----------------------- */
  const safeLower = (v) => (typeof v === "string" ? v.toLowerCase() : "");

  /* -------------------- chargements annexes -------------------- */
  useEffect(() => {
    if (!token) return;

    const loadMedicaments = async () => {
      setLoadingMedicaments(true);
      try {
        const res = await getMedicaments();
        setMedicaments(Array.isArray(res) ? res : res?.rows || []);
      } catch {
        toast.error("❌ Impossible de charger les médicaments");
      } finally {
        setLoadingMedicaments(false);
      }
    };

    const loadConsultations = async () => {
      if (user?.role === "pharmacien") return;
      setLoadingConsultations(true);
      try {
        const res = await getConsultations();
        setConsultations(Array.isArray(res) ? res : res?.rows || []);
      } catch {
        toast.error("❌ Impossible de charger les consultations");
      } finally {
        setLoadingConsultations(false);
      }
    };

    loadMedicaments();
    loadConsultations();
  }, [token, user]);

  /* ----------------------- recherche ----------------------- */
  const filtered = useMemo(() => {
    const q = safeLower(search.trim());
    if (!q) return prescriptions;

    return prescriptions.filter((p) => {
      const patient = p.consultation?.patient || {};
      const med =
        p.medicament?.nom_commercial ||
        p.medicament?.nom ||
        p.medicament_nom ||
        "";
      return (
        safeLower(patient.nom).includes(q) ||
        safeLower(patient.prenom).includes(q) ||
        safeLower(med).includes(q)
      );
    });
  }, [search, prescriptions]);

  /* ----------------------- handlers ----------------------- */
  const handleSave = async (payload) => {
    try {
      if (selected) {
        await edit(selected.id, payload);
        toast.success("✏️ Prescription modifiée");
      } else {
        const res = await add(payload);
        toast.success("📝 Prescription créée");
        if (res?.rupture && res?.prescription) {
          toast.warning("⚠️ Médicament en rupture");
          printOrdonnancePDF(res.prescription);
        }
      }
      setOpenPrescriptionModal(false);
      setSelected(null);
    } catch (err) {
      toast.error(err?.message || "❌ Erreur enregistrement");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette prescription ?")) return;
    try {
      await remove(id);
      toast.success("🗑️ Prescription supprimée");
    } catch {
      toast.error("❌ Erreur suppression");
    }
  };

  const handleDeliver = async (payload) => {
    if (!selected) return;
    try {
      await deliver(selected.id, payload);
      toast.success("💊 Prescription délivrée");
      setOpenDeliverModal(false);
      setSelected(null);
    } catch (err) {
      if (err?.rupture) {
        toast.error("⚠️ Stock insuffisant");
        if (window.confirm("Imprimer l'ordonnance ?")) {
          printOrdonnancePDF(selected);
        }
      } else {
        toast.error("❌ Erreur délivrance");
      }
    }
  };

  const handlePrint = (p) => {
    try {
      printOrdonnancePDF(p);
      toast.success("📄 Ordonnance générée");
    } catch {
      toast.error("❌ Impression impossible");
    }
  };

  /* ----------------------- UI ----------------------- */
  if (!token) {
    return (
      <div className="p-6 text-red-500">
        Vous devez être authentifié pour accéder à cette page.
      </div>
    );
  }

  const isLoading = loading || loadingMedicaments || loadingConsultations;

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4 gap-2 flex-wrap">
        <h1 className="text-xl font-semibold">💊 Prescriptions</h1>
        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Rechercher"
            className="border rounded px-3 py-2"
          />
          {user?.role === "medecin" && (
            <button
              onClick={() => {
                setSelected(null);
                setOpenPrescriptionModal(true);
              }}
              className="bg-blue-600 text-white px-3 py-2 rounded"
            >
              + Prescrire
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded overflow-x-auto">
        {isLoading ? (
          <div className="py-6 text-center text-gray-500">⏳ Chargement...</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2 text-left">Patient</th>
                <th className="px-4 py-2 text-left">Médicament</th>
                <th className="px-4 py-2 text-left">Posologie</th>
                <th className="px-4 py-2 text-left">Durée</th>
                <th className="px-4 py-2 text-left">Statut</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.map((p, i) => (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{i + 1}</td>
                    <td className="px-4 py-2">
                      {p.consultation?.patient
                        ? `${p.consultation.patient.nom} ${p.consultation.patient.prenom || ""}`
                        : "-"}
                    </td>
                    <td className="px-4 py-2">
                      {p.medicament?.nom_commercial ||
                        p.medicament?.nom ||
                        p.medicament_nom ||
                        "-"}
                    </td>
                    <td className="px-4 py-2">{p.posologie}</td>
                    <td className="px-4 py-2">{p.duree}</td>
                    <td className="px-4 py-2">{p.statut}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button onClick={() => handlePrint(p)}>📄</button>
                      {user?.role === "pharmacien" && (
                        <button
                          onClick={() => {
                            setSelected(p);
                            setOpenDeliverModal(true);
                          }}
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
                        >
                          ✏️
                        </button>
                      )}
                      {(user?.role === "admin" ||
                        user?.role === "medecin") && (
                        <button onClick={() => handleDelete(p.id)}>🗑️</button>
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
        onSave={handleSave}
        medicaments={medicaments}
        consultations={consultations}
        prescription={selected}
        saving={saving}
      />

      <DeliverModal
        open={openDeliverModal}
        onClose={() => {
          setOpenDeliverModal(false);
          setSelected(null);
        }}
        onDeliver={handleDeliver}
        prescription={selected}
        medicaments={medicaments}
        saving={saving}
      />
    </div>
  );
}
