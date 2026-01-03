// src/components/hospitalisations/HospitalisationModal.jsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getPatients } from "../../api/patients";
import { getUsers } from "../../api/users";
import { useAuth } from "../../auth/AuthContext";

export default function HospitalisationModal({ open, onClose, onSave, hospitalisation }) {
  const { token } = useAuth();

  const [patientId, setPatientId] = useState("");
  const [medecinId, setMedecinId] = useState("");
  const [infirmierId, setInfirmierId] = useState("");
  const [dateEntree, setDateEntree] = useState("");
  const [dateSortie, setDateSortie] = useState("");
  const [service, setService] = useState("");
  const [diagnostic, setDiagnostic] = useState("");
  const [traitement, setTraitement] = useState("");
  const [observations, setObservations] = useState("");
  const [statut, setStatut] = useState("admise");

  const [patients, setPatients] = useState([]);
  const [users, setUsers] = useState([]);

  // 🔄 Charger patients et utilisateurs
  useEffect(() => {
    if (!token || !open) return;

    (async () => {
      try {
        const ptsRes = await getPatients(token);
        const usrRes = await getUsers(token);

        const pts = Array.isArray(ptsRes?.patients)
          ? ptsRes.patients
          : Array.isArray(ptsRes)
          ? ptsRes
          : [];

        const usrs = Array.isArray(usrRes?.rows)
          ? usrRes.rows
          : Array.isArray(usrRes)
          ? usrRes
          : [];

        setPatients(pts);
        setUsers(usrs);
      } catch (err) {
        console.error("❌ Erreur chargement patients/utilisateurs:", err);
        toast.error("Impossible de charger patients/médecins/infirmiers ❌");
        setPatients([]);
        setUsers([]);
      }
    })();
  }, [token, open]);

  // ✏️ Pré-remplissage si édition
  useEffect(() => {
    if (hospitalisation) {
      setPatientId(hospitalisation.patient_id ?? "");
      setMedecinId(hospitalisation.medecin_id ?? "");
      setInfirmierId(hospitalisation.infirmier_id ?? "");
      setDateEntree(hospitalisation.date_entree ?? "");
      setDateSortie(hospitalisation.date_sortie ?? "");
      setService(hospitalisation.service ?? "");
      setDiagnostic(hospitalisation.diagnostic_admission ?? "");
      setTraitement(hospitalisation.traitement ?? "");
      setObservations(hospitalisation.observations ?? "");
      setStatut(hospitalisation.statut ?? "admise");
    } else {
      setPatientId("");
      setMedecinId("");
      setInfirmierId("");
      setDateEntree("");
      setDateSortie("");
      setService("");
      setDiagnostic("");
      setTraitement("");
      setObservations("");
      setStatut("admise");
    }
  }, [hospitalisation]);

  const handleSubmit = () => {
    if (!patientId || !medecinId || !dateEntree) {
      toast.error("⚠️ Patient, médecin et date d’entrée sont obligatoires");
      return;
    }

    const payload = {
      patient_id: Number(patientId),
      medecin_id: Number(medecinId),
      infirmier_id: infirmierId ? Number(infirmierId) : null,
      date_entree: dateEntree,
      date_sortie: dateSortie || null,
      service,
      diagnostic_admission: diagnostic,
      traitement,
      observations,
      statut,
    };

    console.log("📤 Payload hospitalisation:", payload);
    onSave(payload);
  };

  if (!open) return null;

  const medecins = Array.isArray(users) ? users.filter((u) => u.role === "medecin") : [];
  const infirmiers = Array.isArray(users) ? users.filter((u) => u.role === "infirmier") : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-lg font-semibold mb-4">
          {hospitalisation ? "✏️ Modifier hospitalisation" : "➕ Nouvelle hospitalisation"}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Patient */}
          <div className="col-span-2">
            <label className="block text-sm">Patient</label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="border rounded w-full px-3 py-2"
            >
              <option value="">-- Choisir --</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nom} {p.postnom || ""} {p.prenom}
                </option>
              ))}
            </select>
          </div>

          {/* Médecin */}
          <div>
            <label className="block text-sm">Médecin</label>
            <select
              value={medecinId}
              onChange={(e) => setMedecinId(e.target.value)}
              className="border rounded w-full px-3 py-2"
            >
              <option value="">-- Choisir --</option>
              {medecins.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.noms}
                </option>
              ))}
            </select>
          </div>

          {/* Infirmier */}
          <div>
            <label className="block text-sm">Infirmier</label>
            <select
              value={infirmierId}
              onChange={(e) => setInfirmierId(e.target.value)}
              className="border rounded w-full px-3 py-2"
            >
              <option value="">-- Choisir --</option>
              {infirmiers.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.noms}
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div>
            <label className="block text-sm">Date entrée</label>
            <input
              type="date"
              value={dateEntree}
              onChange={(e) => setDateEntree(e.target.value)}
              className="border rounded w-full px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm">Date sortie</label>
            <input
              type="date"
              value={dateSortie}
              onChange={(e) => setDateSortie(e.target.value)}
              className="border rounded w-full px-3 py-2"
            />
          </div>

          {/* Service */}
          <div className="col-span-2">
            <label className="block text-sm">Service</label>
            <input
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="border rounded w-full px-3 py-2"
            />
          </div>

          {/* Diagnostic */}
          <div className="col-span-2">
            <label className="block text-sm">Diagnostic admission</label>
            <textarea
              value={diagnostic}
              onChange={(e) => setDiagnostic(e.target.value)}
              className="border rounded w-full px-3 py-2"
              rows={2}
            />
          </div>

          {/* Traitement */}
          <div className="col-span-2">
            <label className="block text-sm">Traitement</label>
            <textarea
              value={traitement}
              onChange={(e) => setTraitement(e.target.value)}
              className="border rounded w-full px-3 py-2"
              rows={2}
            />
          </div>

          {/* Observations */}
          <div className="col-span-2">
            <label className="block text-sm">Observations</label>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="border rounded w-full px-3 py-2"
              rows={2}
            />
          </div>

          {/* Statut */}
          <div className="col-span-2">
            <label className="block text-sm">Statut</label>
            <select
              value={statut}
              onChange={(e) => setStatut(e.target.value)}
              className="border rounded w-full px-3 py-2"
            >
              <option value="admise">Admise</option>
              <option value="en_cours">En cours</option>
              <option value="cloturee">Clôturée</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded border">
            ❌ Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700"
          >
            💾 Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
