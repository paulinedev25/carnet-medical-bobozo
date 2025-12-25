// src/components/consultations/ConsultationModal.jsx
import { useEffect, useState } from "react";
import { getPatients } from "../../api/patients";
import { getMedecins } from "../../api/users";
import { useAuth } from "../../auth/AuthContext";
import { toast } from "react-toastify";

export default function ConsultationModal({ open, onClose, onSave, consultation, token }) {
  const { user } = useAuth();
  const role = (user?.role || "").toLowerCase();

  const isReceptionniste = role === "receptionniste";
  const isMedecin = role === "medecin";
  const isAdmin = role === "admin";

  // ✅ Admin médecin vs admin non médecin
  const isAdminMedecin = isAdmin && user?.fonction?.toLowerCase().includes("médecin");
  const isAdminNonMedecin = isAdmin && !isAdminMedecin;

  // ✅ Raccourci : ceux qui jouent le rôle réceptionniste
  const isReceptionLike = isReceptionniste || isAdminNonMedecin;

  // ✅ Statut consultation
  const statut = consultation?.statut || "ouverte";
  const isEnCours = statut === "en_cours";
  const isCloturee = statut === "cloturee";

  const [form, setForm] = useState({
    patient_id: "",
    medecin_id: "",
    motif: "",
    diagnostic: "",
    traitement: "",
    tension_arterielle: "",
    poids: "",
    temperature: "",
    pouls: "",
    glycemie: "",
  });
  const [errors, setErrors] = useState({});
  const [patients, setPatients] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger patients + médecins
  useEffect(() => {
    if (!open || !token) return;

    (async () => {
      try {
        const patRes = await getPatients(token, { limit: 1000 });
        setPatients(patRes.rows || patRes.patients || []);
      } catch (err) {
        toast.error("❌ Impossible de charger les patients");
        console.error("Erreur chargement patients:", err);
      }

      try {
        const m = await getMedecins(token);
        setMedecins(m || []);
      } catch (err) {
        console.error("Erreur chargement médecins (silencieux):", err);
        setMedecins([]);
      }
    })();
  }, [open, token]);

  // Préremplir formulaire
  useEffect(() => {
    const base = {
      patient_id: consultation?.patient_id || "",
      medecin_id:
        consultation?.medecin_id ??
        (!consultation && (isMedecin || isAdminMedecin) ? (user?.id || "") : ""),
      motif: consultation?.motif || "",
      diagnostic: consultation?.diagnostic || "",
      traitement: consultation?.traitement || "",
      tension_arterielle: consultation?.tension_arterielle || "",
      poids: consultation?.poids || "",
      temperature: consultation?.temperature || "",
      pouls: consultation?.pouls || "",
      glycemie: consultation?.glycemie || "",
    };
    setForm(base);
    setErrors({});
  }, [consultation, open, user, isMedecin, isAdminMedecin]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.patient_id) newErrors.patient_id = "Le patient est obligatoire";
    if (!consultation && !form.medecin_id && !isMedecin && !isAdminMedecin) {
      newErrors.medecin_id = "Le médecin est obligatoire";
    }
    if (!form.motif) newErrors.motif = "Le motif est obligatoire";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSave(form);
      toast.success(consultation ? "Consultation mise à jour ✅" : "Consultation enregistrée ✅");
      onClose();
    } catch (err) {
      console.error("Erreur enregistrement consultation:", err);
      toast.error("❌ Échec de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const disableAll = isCloturee; // 🔒 consultation clôturée = lecture seule

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
        <h2 className="text-xl font-bold mb-4">
          {consultation ? "Modifier consultation" : "Nouvelle consultation"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
          {/* Patient */}
          <div>
            <label className="block text-sm font-medium">Patient *</label>
            <select
              name="patient_id"
              value={form.patient_id}
              onChange={handleChange}
              disabled={disableAll}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">-- Sélectionner un patient --</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {[p.nom, p.postnom, p.prenom].filter(Boolean).join(" ")} ({p.numero_dossier || "N/A"})
                </option>
              ))}
            </select>
            {errors.patient_id && <p className="text-red-600 text-sm">{errors.patient_id}</p>}
          </div>

          {/* Médecin */}
          <div>
            <label className="block text-sm font-medium">Médecin *</label>
            {isCloturee || isEnCours || isMedecin || isAdminMedecin ? (
              <input
                type="text"
                value={consultation?.medecin?.noms || user?.noms || "Non défini"}
                disabled
                className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            ) : (
              <select
                name="medecin_id"
                value={form.medecin_id}
                onChange={handleChange}
                disabled={disableAll}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">-- Sélectionner un médecin --</option>
                {medecins.length === 0 && <option value="">Aucun médecin disponible</option>}
                {medecins.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.noms} ({m.fonction || "Médecin"})
                  </option>
                ))}
              </select>
            )}
            {errors.medecin_id && <p className="text-red-600 text-sm">{errors.medecin_id}</p>}
          </div>

          {/* Motif */}
          <div>
            <label className="block text-sm font-medium">Motif *</label>
            <input
              type="text"
              name="motif"
              value={form.motif}
              onChange={handleChange}
              disabled={disableAll}
              className="w-full border rounded px-3 py-2"
            />
            {errors.motif && <p className="text-red-600 text-sm">{errors.motif}</p>}
          </div>

          {/* Examens */}
          <div className="grid grid-cols-2 gap-4">
            {["tension_arterielle", "poids", "temperature", "pouls", "glycemie"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium capitalize">{field.replace("_", " ")}</label>
                <input
                  type="text"
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  disabled={disableAll}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            ))}
          </div>

          {/* Diagnostic */}
          <div>
            <label className="block text-sm font-medium">Diagnostic</label>
            <textarea
              name="diagnostic"
              value={form.diagnostic}
              onChange={handleChange}
              disabled={disableAll || isReceptionLike}
              className={`w-full border rounded px-3 py-2 ${
                disableAll || isReceptionLike ? "bg-gray-100 text-gray-600 cursor-not-allowed" : ""
              }`}
              rows={2}
            />
          </div>

          {/* Traitement */}
          <div>
            <label className="block text-sm font-medium">Traitement</label>
            <textarea
              name="traitement"
              value={form.traitement}
              onChange={handleChange}
              disabled={disableAll || isReceptionLike}
              className={`w-full border rounded px-3 py-2 ${
                disableAll || isReceptionLike ? "bg-gray-100 text-gray-600 cursor-not-allowed" : ""
              }`}
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded" disabled={loading}>
              Annuler
            </button>
            {!disableAll && (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Enregistrement..." : consultation ? "Mettre à jour" : "Enregistrer"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
