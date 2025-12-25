import { jsPDF } from "jspdf";

export default function ExamenDetailsModal({ open, onClose, examen }) {
  if (!open || !examen) return null;

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Détails Examen</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; }
            p { margin: 4px 0; }
            hr { margin: 8px 0; }
          </style>
        </head>
        <body>
          <h2>🧪 Résultat d'Examen</h2>
          <p><strong>Type :</strong> ${examen.type_examen}</p>
          <p><strong>Patient :</strong> ${examen.consultation?.patient?.nom || "-"}</p>
          <p><strong>Médecin :</strong> ${examen.medecin?.noms || "-"}</p>
          <p><strong>Laborantin :</strong> ${examen.laborantin?.noms || "-"}</p>
          <p><strong>Date prescription :</strong> ${examen.date_prescription || "-"}</p>
          <p><strong>Statut :</strong> ${examen.statut}</p>
          <hr />
          <p><strong>Résultats :</strong></p>
          ${
            examen.resultats && examen.resultats.length > 0
              ? `<ul>${examen.resultats
                  .map(
                    (r) =>
                      `<li>${r.parametre}: ${r.valeur} ${r.unite} (${r.interpretation})</li>`
                  )
                  .join("")}</ul>`
              : "<p>Non disponible</p>"
          }
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("🧪 Résultat d'Examen", 10, 15);

    doc.setFontSize(11);
    doc.text(`Type: ${examen.type_examen}`, 10, 30);
    doc.text(`Patient: ${examen.consultation?.patient?.nom || "-"}`, 10, 40);
    doc.text(`Médecin: ${examen.medecin?.noms || "-"}`, 10, 50);
    doc.text(`Laborantin: ${examen.laborantin?.noms || "-"}`, 10, 60);
    doc.text(`Date prescription: ${examen.date_prescription || "-"}`, 10, 70);
    doc.text(`Statut: ${examen.statut}`, 10, 80);

    if (examen.resultats?.length > 0) {
      doc.text("Résultats :", 10, 95);
      examen.resultats.forEach((r, i) => {
        doc.text(`${r.parametre}: ${r.valeur} ${r.unite} (${r.interpretation})`, 10, 105 + i * 10, { maxWidth: 180 });
      });
    }

    doc.save(`examen-${examen.id}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-4">👁️ Détails de l'Examen</h2>

        <div className="space-y-2 text-sm">
          <p><strong>Type :</strong> {examen.type_examen}</p>
          <p><strong>Patient :</strong> {examen.consultation?.patient?.nom || "-"}</p>
          <p><strong>Médecin :</strong> {examen.medecin?.noms || "-"}</p>
          <p><strong>Laborantin :</strong> {examen.laborantin?.noms || "-"}</p>
          <p><strong>Date prescription :</strong> {examen.date_prescription || "-"}</p>
          <p><strong>Statut :</strong> {examen.statut}</p>
          <hr />
          <p><strong>Résultats :</strong></p>
          {examen.resultats?.length > 0 ? (
            <ul className="list-disc pl-5">
              {examen.resultats.map((r) => (
                <li key={r.id}>
                  {r.parametre}: {r.valeur} {r.unite} ({r.interpretation})
                </li>
              ))}
            </ul>
          ) : (
            <p>Non disponible</p>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={handlePrint} className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700">🖨️ Imprimer</button>
          <button onClick={handleDownloadPDF} className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">📄 PDF</button>
          <button onClick={onClose} className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300">Fermer</button>
        </div>
      </div>
    </div>
  );
}
