export default function SoinsInfirmiersDetailsModal({ open, onClose, soin }) {
  if (!open || !soin) return null;
  return (
    <div className="modal fixed inset-0 flex justify-center items-center bg-black bg-opacity-25">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">🩹 Détail soin infirmier</h2>
        <div className="space-y-2 text-sm">
          <div><strong>Type :</strong> {soin.type_soin}</div>
          <div><strong>Infirmier :</strong> {soin.infirmier?.noms}</div>
          <div><strong>Médecin :</strong> {soin.medecin?.noms}</div>
          <div><strong>Date :</strong> {new Date(soin.date_soin).toLocaleString()}</div>
          <div><strong>Observations :</strong> {soin.observations}</div>
          <div><strong>Statut :</strong> {soin.statut_validation}</div>
        </div>
        <div className="mt-4 text-right">
          <button onClick={onClose} className="px-3 py-2 bg-gray-300 rounded">Fermer</button>
        </div>
      </div>
    </div>
  );
}
