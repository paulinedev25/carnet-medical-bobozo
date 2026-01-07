import { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

export default function ConsultationForm({ consultation, patientId, onSave }) {
  const [formData, setFormData] = useState({
    motif: "",
    date_consultation: "",
    medecin_id: "",
    observations_initiales: "",
  });
  const [medecins, setMedecins] = useState([]);

  useEffect(() => {
    if (consultation) {
      setFormData({
        motif: consultation.motif || "",
        date_consultation: consultation.date_consultation?.slice(0, 16) || "",
        medecin_id: consultation.medecin_id || "",
        observations_initiales: consultation.observations_initiales || "",
      });
    }
  }, [consultation]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/users");
        setMedecins((res.data || []).filter(u => (u.role || "").toLowerCase() === "medecin"));
      } catch (err) {
        console.error("Erreur chargement médecins", err);
      }
    })();
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (consultation?.id) {
        await api.put(`/consultations/${consultation.id}`, { ...formData, patient_id: patientId });
        toast.success("Consultation mise à jour");
      } else {
        await api.post("/consultations", { ...formData, patient_id: patientId });
        toast.success("Consultation créée");
      }
      onSave();
    } catch (err) {
      console.error("Erreur sauvegarde :", err);
      toast.error("❌ Erreur API");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Motif</label>
        <input
          name="motif"
          value={formData.motif}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Date / Heure</label>
        <input
          type="datetime-local"
          name="date_consultation"
          value={formData.date_consultation}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Médecin</label>
        <select
          name="medecin_id"
          value={formData.medecin_id}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
          required
        >
          <option value="">Sélectionner...</option>
          {medecins.map(m => (
            <option key={m.id} value={m.id}>
              {m.noms}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Observations</label>
        <textarea
          name="observations_initiales"
          value={formData.observations_initiales}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        {consultation?.id ? "Mettre à jour" : "Créer"}
      </button>
    </form>
  );
}
