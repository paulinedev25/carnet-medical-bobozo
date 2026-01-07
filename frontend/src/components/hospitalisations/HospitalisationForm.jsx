import { useState, useEffect } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

export default function HospitalisationForm({ hospitalisation, patientId, onSave }) {
  const [formData, setFormData] = useState({
    service: "",
    date_entree: "",
    infirmier_id: "",
    medecin_id: "",
    statut: "admise",
  });

  const [medecins, setMedecins] = useState([]);
  const [infirmiers, setInfirmiers] = useState([]);

  useEffect(() => {
    if (hospitalisation) {
      setFormData({
        service: hospitalisation.service || "",
        date_entree: hospitalisation.date_entree?.slice(0, 16) || "",
        infirmier_id: hospitalisation.infirmier_id || "",
        medecin_id: hospitalisation.medecin_id || "",
        statut: hospitalisation.statut || "admise",
      });
    }
  }, [hospitalisation]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/users");
        const all = res.data || [];
        setMedecins(all.filter(u => (u.role || "").toLowerCase() === "medecin"));
        setInfirmiers(all.filter(u => (u.role || "").toLowerCase() === "infirmier"));
      } catch (err) {
        console.error("Erreur chargement utilisateurs", err);
      }
    })();
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (hospitalisation?.id) {
        await api.put(`/hospitalisations/${hospitalisation.id}`, { ...formData, patient_id: patientId });
        toast.success("Hospitalisation mise à jour");
      } else {
        await api.post("/hospitalisations", { ...formData, patient_id: patientId });
        toast.success("Hospitalisation créée");
      }
      onSave();
    } catch (err) {
      console.error("Erreur hospitalisation :", err);
      toast.error("❌ Erreur API");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Service</label>
        <input
          name="service"
          value={formData.service}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Date entrée</label>
        <input
          type="datetime-local"
          name="date_entree"
          value={formData.date_entree}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Infirmier</label>
        <select
          name="infirmier_id"
          value={formData.infirmier_id}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="">Sélectionner...</option>
          {infirmiers.map(i => (
            <option key={i.id} value={i.id}>
              {i.noms}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Médecin</label>
        <select
          name="medecin_id"
          value={formData.medecin_id}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
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
        <label className="block text-sm font-medium">Statut</label>
        <select
          name="statut"
          value={formData.statut}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="admise">Admise</option>
          <option value="en_cours">En cours</option>
          <option value="cloturee">Clôturée</option>
        </select>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        {hospitalisation?.id ? "Mettre à jour" : "Créer"}
      </button>
    </form>
  );
}
