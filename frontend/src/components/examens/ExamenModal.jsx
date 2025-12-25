// src/components/examens/ExamenModal.jsx
import { useState, useEffect } from "react";
import { getConsultations } from "../../api/consultations";
import { useAuth } from "../../auth/AuthContext";

export default function ExamenModal({ open, onClose, onSave, examen }) {
  const { token } = useAuth();

  const [consultationId, setConsultationId] = useState("");
  const [typeExamen, setTypeExamen] = useState("");
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Charger les consultations ouvertes et préremplir en mode édition
  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const { rows } = await getConsultations(token, { statut: "ouverte" });
        setConsultations(rows);

        if (examen) {
          setConsultationId(examen.consultation_id ?? "");
          setTypeExamen(examen.type_examen ?? "");
        } else if (rows.length === 1) {
          setConsultationId(rows[0].id);
          setTypeExamen("");
        } else {
          setConsultationId("");
          setTypeExamen("");
        }
      } catch (err) {
        console.error("Erreur chargement consultations:", err);
        setError("Impossible de charger les consultations ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open, token, examen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!consultationId) return setError("⚠️ Vous devez sélectionner une consultation.");
    if (!typeExamen.trim()) return setError("⚠️ Le type d'examen est obligatoire.");

    onSave({
      consultation_id: Number(consultationId),
      type_examen: typeExamen.trim(),
    });
  };

  const handleClose = () => {
    if (!examen) {
      setConsultationId("");
      setTypeExamen("");
    }
    setError("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          {examen ? "✏️ Modifier un examen" : "🧾 Prescrire un examen"}
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Consultation */}
          <div>
            <label className="block text-sm font-medium">Consultation</label>
            {loading ? (
              <p className="text-gray-500 text-sm">⏳ Chargement...</p>
            ) : consultations.length > 0 ? (
              <select
                value={consultationId}
                onChange={(e) => {
                  setConsultationId(e.target.value);
                  if (error) setError(""); // reset erreur si l'utilisateur interagit
                }}
                className="w-full border rounded px-3 py-2 mt-1"
                disabled={loading || !!examen} // ⚠️ empêche modification si édition
              >
                <option value="">-- Sélectionner --</option>
                {consultations.map((c) => (
                  <option key={c.id} value={c.id}>
                    #{c.id} - {c.motif} (
                    {new Date(c.date_consultation).toLocaleDateString("fr-FR")})
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-red-500 text-sm">
                ⚠️ Aucune consultation ouverte disponible.
              </p>
            )}
          </div>

          {/* Type d'examen */}
          <div>
            <label className="block text-sm font-medium">Type d'examen</label>
            <input
              type="text"
              value={typeExamen}
              onChange={(e) => {
                setTypeExamen(e.target.value);
                if (error) setError(""); // reset erreur si modification
              }}
              placeholder="Ex: Hémogramme, Glycémie..."
              className="w-full border rounded px-3 py-2 mt-1"
              disabled={loading}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || consultations.length === 0}
              className={`px-4 py-2 text-white rounded ${
                examen
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } disabled:opacity-50`}
            >
              {loading ? "⏳..." : examen ? "Mettre à jour" : "Prescrire"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
