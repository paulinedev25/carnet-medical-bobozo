import { format } from "date-fns";

export default function ApprovisionnementHistoriqueModal({
  open,
  onClose,
  medicament,
  historique = [],
}) {
  if (!open) return null;

  const medicName = medicament?.nom_commercial || medicament?.nom || "Médicament";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          📊 Historique – {medicName}
        </h2>

        {historique.length > 0 ? (
          <div className="overflow-x-auto max-h-[60vh] border rounded">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Quantité</th>
                  <th className="px-4 py-2 text-left">Fournisseur</th>
                  <th className="px-4 py-2 text-left">Observations</th>
                </tr>
              </thead>
              <tbody>
                {historique.map((a) => {
                  const dateStr = a.date_approvisionnement
                    ? format(new Date(a.date_approvisionnement), "dd/MM/yyyy")
                    : "-";
                  return (
                    <tr key={a.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{dateStr}</td>
                      <td
                        className={`px-4 py-2 font-medium ${
                          Number(a.quantite) <= 5 ? "text-red-600" : ""
                        }`}
                      >
                        {a.quantite ?? "-"}
                      </td>
                      <td className="px-4 py-2">{a.fournisseur || "-"}</td>
                      <td className="px-4 py-2">{a.observations || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6">
            Aucun approvisionnement enregistré pour ce médicament.
          </p>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
