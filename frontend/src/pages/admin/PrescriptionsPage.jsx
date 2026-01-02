// src/pages/admin/PrescriptionsPage.jsx
import { useState, useEffect, useMemo } from "react";
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
    fetchByConsultation,
  } = usePrescriptions();

  const [medicaments, setMedicaments] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [openPrescriptionModal, setOpenPrescriptionModal] = useState(false);
  const [openDeliverModal, setOpenDeliverModal] = useState(false);

  // ---------- chargement médicaments ----------
  useEffect(() => {
    if (!token) return;
    const loadMedicaments = async () => {
      try {
        const res = await getMedicaments();
        setMedicaments(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Erreur chargement médicaments", err);
        toast.error("❌ Impossible de charger les médicaments");
      }
    };
    loadMedicaments();
  }, [token]);

  // ---------- chargement consultations ----------
  useEffect(() => {
    if (!token || user?.role === "pharmacien") return;
    const loadConsultations = async () => {
      try {
        const res = await getConsultations();
        setConsultations(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Erreur chargement consultations", err);
        toast.error("❌ Impossible de charger les consultations");
      }
    };
    loadConsultations();
  }, [token, user]);

  // ---------- recherche ----------
  const filtered = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    if (!q) return prescriptions;
    return prescriptions.filter((p) => {
      const patient = p.consultation?.patient || {};
      const medName =
        p.medicament?.nom_commercial || p.medicament?.nom || p.medicament_nom || "";
      return (
        (patient.nom || "").toLowerCase().includes(q) ||
        (patient.prenom || "").toLowerCase().includes(q) ||
        medName.toLowerCase().includes(q)
      );
    });
  }, [search, prescriptions]);

  // ---------- CRUD handlers ----------
  const handleSave = async (payload) => {
    try {
      if (selected) await edit(selected.id, payload);
      else await add(payload);

      setOpenPrescriptionModal(false);
      setSelected(null);
      toast.success("✅ Prescription enregistrée");
    } catch (err) {
      console.error("Erreur sauvegarde prescription", err);
      toast.error(err?.message || "❌ Erreur sauvegarde prescription");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Supprimer cette prescription ?")) return;
    try {
      await remove(id);
      toast.success("🗑️ Prescription supprimée");
    } catch (err) {
      console.error("Erreur suppression prescription", err);
      toast.error(err?.message || "❌ Erreur suppression");
    }
  };

  const handleDeliver = async (payload) => {
    if (!selected) return toast.error("⚠️ Aucune prescription sélectionnée");
    try {
      await deliver(selected.id, payload);
      setOpenDeliverModal(false);
      setSelected(null);
      toast.success("💊 Prescription délivrée");
    } catch (err) {
      console.error("Erreur délivrance", err);
      if (err?.rupture) {
        toast.error(err.message || "⚠️ Stock insuffisant");
        if (window.confirm("Imprimer l'ordonnance malgré la rupture ?")) {
          printOrdonnancePDF(selected);
        }
      } else {
        toast.error(err?.message || "❌ Erreur délivrance");
      }
    }
  };

  const handlePrint = (prescription) => {
    try {
      printOrdonnancePDF(prescription);
      toast.success("Ordonnance PDF générée");
    } catch (err) {
      console.error("Erreur impression ordonnance", err);
      toast.error("❌ Impossible de générer l'ordonnance");
    }
  };

  if (!token) {
    return (
      <div className="p-6 text-red-500">
        Vous devez être authentifié pour accéder à cette page.
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">💊 Prescriptions</h1>
        <div className="flex gap-2 items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Rechercher patient / médicament"
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
        {loading ? (
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
                        ? `${p.medicament.nom_commercial || p.medicament.nom || p.medicament_nom} ${p.medicament.unite || ""}`
                        : "-"}
                    </td>
                    <td className="px-4 py-2">{p.posologie}</td>
                    <td className="px-4 py-2">{p.duree}</td>
                    <td className="px-4 py-2">{p.statut}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button onClick={() => handlePrint(p)} className="px-2 py-1 rounded border hover:bg-gray-100">📄</button>
                      {user?.role === "pharmacien" && (
                        <button
                          onClick={() => { setSelected(p); setOpenDeliverModal(true); }}
                          className="px-2 py-1 rounded border hover:bg-green-100"
                        >
                          💊
                        </button>
                      )}
                      {user?.role === "medecin" && (
                        <button
                          onClick={() => { setSelected(p); setOpenPrescriptionModal(true); }}
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
        onClose={() => { setOpenPrescriptionModal(false); setSelected(null); }}
        onSave={handleSave}
        medicaments={medicaments}
        consultations={consultations}
        prescription={selected}
      />
      <DeliverModal
        open={openDeliverModal}
        onClose={() => { setOpenDeliverModal(false); setSelected(null); }}
        onDeliver={handleDeliver}
        prescription={selected}
        medicaments={medicaments}
      />
    </div>
  );
}
