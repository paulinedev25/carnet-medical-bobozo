import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function PatientModal({ open, onClose, onSave, patient }) {
  const [form, setForm] = useState({
    nom: "",
    postnom: "",
    prenom: "",
    sexe: "",
    date_naissance: "",
    adresse: "",
    numero_dossier: "",
    fonction: "",
    grade: "",
    matricule: "",
    unite: "",
    telephone: "",
  });

  useEffect(() => {
    if (patient) {
      setForm({
        nom: patient.nom || "",
        postnom: patient.postnom || "",
        prenom: patient.prenom || "",
        sexe: patient.sexe || "",
        date_naissance: patient.date_naissance || "",
        adresse: patient.adresse || "",
        numero_dossier: patient.numero_dossier || "",
        fonction: patient.fonction || "",
        grade: patient.grade || "",
        matricule: patient.matricule || "",
        unite: patient.unite || "",
        telephone: patient.telephone || "",
      });
    } else {
      setForm({
        nom: "",
        postnom: "",
        prenom: "",
        sexe: "",
        date_naissance: "",
        adresse: "",
        numero_dossier: "", // généré automatiquement côté backend
        fonction: "",
        grade: "",
        matricule: "",
        unite: "",
        telephone: "",
      });
    }
  }, [patient]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave(form);
      toast.success(patient ? "Patient mis à jour ✅" : "Patient créé ✅");
      onClose();
    } catch (error) {
      console.error("Erreur enregistrement patient:", error);
      toast.error("❌ Impossible d'enregistrer le patient");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">
          {patient ? "Modifier le patient" : "Nouveau patient"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium">Nom *</label>
            <input
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Postnom */}
          <div>
            <label className="block text-sm font-medium">Postnom</label>
            <input
              type="text"
              name="postnom"
              value={form.postnom}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Prénom */}
          <div>
            <label className="block text-sm font-medium">Prénom</label>
            <input
              type="text"
              name="prenom"
              value={form.prenom}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Sexe */}
          <div>
            <label className="block text-sm font-medium">Sexe *</label>
            <select
              name="sexe"
              value={form.sexe}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="">-- Sélectionner --</option>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>
          </div>

          {/* Date naissance */}
          <div>
            <label className="block text-sm font-medium">Date de naissance</label>
            <input
              type="date"
              name="date_naissance"
              value={form.date_naissance}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Adresse */}
          <div>
            <label className="block text-sm font-medium">Adresse</label>
            <input
              type="text"
              name="adresse"
              value={form.adresse}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Fonction */}
          <div>
            <label className="block text-sm font-medium">Fonction</label>
            <input
              type="text"
              name="fonction"
              value={form.fonction}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Grade */}
          <div>
            <label className="block text-sm font-medium">Grade</label>
            <input
              type="text"
              name="grade"
              value={form.grade}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Matricule */}
          <div>
            <label className="block text-sm font-medium">Matricule</label>
            <input
              type="text"
              name="matricule"
              value={form.matricule}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Unité */}
          <div>
            <label className="block text-sm font-medium">Unité</label>
            <input
              type="text"
              name="unite"
              value={form.unite}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-medium">Téléphone</label>
            <input
              type="text"
              name="telephone"
              value={form.telephone}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Numéro de dossier (readonly si patient existe) */}
          {patient && (
            <div>
              <label className="block text-sm font-medium">Numéro de dossier</label>
              <input
                type="text"
                name="numero_dossier"
                value={form.numero_dossier}
                disabled
                className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {patient ? "Mettre à jour" : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
