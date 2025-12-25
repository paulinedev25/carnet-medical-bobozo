import { useEffect, useState, useRef } from "react";

export default function ResultatModal({ open, onClose, onSave, examen }) {
  const [parametres, setParametres] = useState([]);
  const [initialParametres, setInitialParametres] = useState([]); // 🔑 pour détecter modifications
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const firstInputRef = useRef(null);

  // Pré-remplissage à l'ouverture
  useEffect(() => {
    if (!open) return;
    const initial = examen?.resultats?.length
      ? examen.resultats.map((r) => ({
          parametre: r.parametre,
          valeur: r.valeur,
          unite: r.unite,
          interpretation: r.interpretation,
        }))
      : [{ parametre: "", valeur: "", unite: "", interpretation: "" }];
    setParametres(initial);
    setInitialParametres(initial); // sauvegarde état initial
    setError("");
    setLoading(false);
    setTimeout(() => firstInputRef.current?.focus(), 50);
  }, [open, examen]);

  const handleChange = (index, field, value) => {
    setParametres((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const addLine = () =>
    setParametres((prev) => [
      ...prev,
      { parametre: "", valeur: "", unite: "", interpretation: "" },
    ]);

  const removeLine = (index) =>
    setParametres((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== index) : prev
    );

  // Vérifie si l'utilisateur a modifié quelque chose
  const hasUnsavedChanges = () =>
    JSON.stringify(parametres) !== JSON.stringify(initialParametres);

  const handleClose = () => {
    if (hasUnsavedChanges() && !loading) {
      const confirmClose = window.confirm(
        "⚠️ Vous avez des modifications non enregistrées. Voulez-vous vraiment fermer ?"
      );
      if (!confirmClose) return;
    }
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");

    const hasEmpty = parametres.some(
      (p) => !p.parametre.trim() || !p.valeur.trim()
    );
    if (hasEmpty) {
      setError("⚠️ Tous les paramètres et valeurs sont obligatoires.");
      return;
    }

    try {
      setLoading(true);
      await onSave({ parametres });
      setInitialParametres(parametres); // remet à jour état initial après succès
    } catch (err) {
      console.error("❌ Erreur enregistrement résultat :", err);
      setError(
        err.response?.data?.error || "Erreur serveur lors de l'enregistrement."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open || !examen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <h2 className="text-lg font-semibold mb-1">
          🔬 Résultats pour l'examen #{examen.id} ({examen.type_examen})
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          🧑‍⚕️ Patient :{" "}
          <span className="font-medium">
            {examen.consultation?.patient?.nom}{" "}
            {examen.consultation?.patient?.prenom}
          </span>
        </p>

        {error && (
          <p className="text-red-600 bg-red-50 p-2 rounded mb-3">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {parametres.map((p, idx) => (
            <div
              key={idx}
              className="grid grid-cols-5 gap-2 items-center"
              aria-label={`Ligne ${idx + 1}`}
            >
              <input
                ref={idx === 0 ? firstInputRef : null}
                type="text"
                placeholder="Paramètre"
                value={p.parametre}
                onChange={(e) =>
                  handleChange(idx, "parametre", e.target.value)
                }
                className="border rounded px-2 py-1"
                aria-invalid={!p.parametre.trim()}
                required
              />
              <input
                type="text"
                placeholder="Valeur"
                value={p.valeur}
                onChange={(e) => handleChange(idx, "valeur", e.target.value)}
                className="border rounded px-2 py-1"
                aria-invalid={!p.valeur.trim()}
                required
              />
              <input
                type="text"
                placeholder="Unité"
                value={p.unite}
                onChange={(e) => handleChange(idx, "unite", e.target.value)}
                className="border rounded px-2 py-1"
              />
              <input
                type="text"
                placeholder="Interpretation"
                value={p.interpretation}
                onChange={(e) =>
                  handleChange(idx, "interpretation", e.target.value)
                }
                className="border rounded px-2 py-1"
              />
              <button
                type="button"
                onClick={() => removeLine(idx)}
                className="text-red-600 hover:underline"
                disabled={parametres.length === 1}
                title="Supprimer cette ligne"
              >
                ✖
              </button>
            </div>
          ))}

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={addLine}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              disabled={loading}
            >
              ➕ Ajouter ligne
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                disabled={loading}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-3 py-1 text-white rounded ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? "Enregistrement..." : "💾 Enregistrer"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
