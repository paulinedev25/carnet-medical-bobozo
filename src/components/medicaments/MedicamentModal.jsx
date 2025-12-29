import { useEffect, useState } from "react";

export default function MedicamentModal({ open, onClose, onSave, medicament }) {
  const [nomCommercial, setNomCommercial] = useState("");
  const [uniteNomCommercial, setUniteNomCommercial] = useState("");
  const [nomDci, setNomDci] = useState("");
  const [uniteNomDci, setUniteNomDci] = useState("");
  const [forme, setForme] = useState("");
  const [uniteForme, setUniteForme] = useState("");
  const [quantite, setQuantite] = useState(0);
  const [uniteQuantite, setUniteQuantite] = useState("");
  const [seuilAlerte, setSeuilAlerte] = useState(5);
  const [uniteSeuil, setUniteSeuil] = useState("");

  useEffect(() => {
    if (open && medicament) {
      setNomCommercial(medicament.nom_commercial || "");
      setUniteNomCommercial(medicament.unite_nom_commercial || "");
      setNomDci(medicament.nom_dci || "");
      setUniteNomDci(medicament.unite_nom_dci || "");
      setForme(medicament.forme || "");
      setUniteForme(medicament.unite_forme || "");
      setQuantite(medicament.quantite_disponible ?? 0);
      setUniteQuantite(medicament.unite_quantite ?? "");
      setSeuilAlerte(medicament.seuil_alerte ?? 5);
      setUniteSeuil(medicament.unite_seuil ?? "");
    } else if (open) {
      setNomCommercial("");
      setUniteNomCommercial("");
      setNomDci("");
      setUniteNomDci("");
      setForme("");
      setUniteForme("");
      setQuantite(0);
      setUniteQuantite("");
      setSeuilAlerte(5);
      setUniteSeuil("");
    }
  }, [open, medicament]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nomCommercial.trim()) {
      alert("⚠️ Le nom commercial est obligatoire");
      return;
    }

    if (quantite < 0) {
      alert("⚠️ La quantité ne peut pas être négative");
      return;
    }

    if (seuilAlerte < 0) {
      alert("⚠️ Le seuil d'alerte ne peut pas être négatif");
      return;
    }

    onSave({
      nom_commercial: nomCommercial.trim(),
      unite_nom_commercial: uniteNomCommercial.trim() || null,
      nom_dci: nomDci.trim() || null,
      unite_nom_dci: uniteNomDci.trim() || null,
      forme: forme.trim() || null,
      unite_forme: uniteForme.trim() || null,
      quantite_disponible: Number(quantite),
      unite_quantite: uniteQuantite.trim() || null,
      seuil_alerte: Number(seuilAlerte),
      unite_seuil: uniteSeuil.trim() || null,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          {medicament ? "✏️ Modifier un médicament" : "➕ Ajouter un médicament"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nom commercial *</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={nomCommercial}
                onChange={(e) => setNomCommercial(e.target.value)}
                className="flex-1 border rounded px-3 py-2 mt-1"
                placeholder="Ex: Paracétamol"
                required
              />
              <input
                type="text"
                value={uniteNomCommercial}
                onChange={(e) => setUniteNomCommercial(e.target.value)}
                className="w-20 border rounded px-2 py-2 mt-1"
                placeholder="mg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Nom DCI</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={nomDci}
                onChange={(e) => setNomDci(e.target.value)}
                className="flex-1 border rounded px-3 py-2 mt-1"
                placeholder="Ex: Acetaminophen"
              />
              <input
                type="text"
                value={uniteNomDci}
                onChange={(e) => setUniteNomDci(e.target.value)}
                className="w-20 border rounded px-2 py-2 mt-1"
                placeholder="mg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Forme</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={forme}
                onChange={(e) => setForme(e.target.value)}
                className="flex-1 border rounded px-3 py-2 mt-1"
                placeholder="Ex: Comprimé"
              />
              <input
                type="text"
                value={uniteForme}
                onChange={(e) => setUniteForme(e.target.value)}
                className="w-20 border rounded px-2 py-2 mt-1"
                placeholder="unité"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Quantité disponible</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={quantite}
                onChange={(e) => setQuantite(Number(e.target.value))}
                className="flex-1 border rounded px-3 py-2 mt-1"
                min="0"
              />
              <input
                type="text"
                value={uniteQuantite}
                onChange={(e) => setUniteQuantite(e.target.value)}
                className="w-20 border rounded px-2 py-2 mt-1"
                placeholder="comprimé"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Seuil d'alerte</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={seuilAlerte}
                onChange={(e) => setSeuilAlerte(Number(e.target.value))}
                className="flex-1 border rounded px-3 py-2 mt-1"
                min="0"
              />
              <input
                type="text"
                value={uniteSeuil}
                onChange={(e) => setUniteSeuil(e.target.value)}
                className="w-20 border rounded px-2 py-2 mt-1"
                placeholder="comprimé"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white rounded bg-blue-600 hover:bg-blue-700"
            >
              {medicament ? "Mettre à jour" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}