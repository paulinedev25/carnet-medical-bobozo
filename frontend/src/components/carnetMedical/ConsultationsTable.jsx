import React from "react";

export default function ConsultationsTable({ consultations }) {

  const formatDate = (dateString) => {
    if (!dateString) return "---";
    const date = new Date(dateString);
    if (isNaN(date)) return "---";
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Motif</th>
            <th className="px-4 py-2">Médecin</th>
          </tr>
        </thead>
        <tbody>
          {consultations.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="px-4 py-2">
                {formatDate(c.date_consultation)}
              </td>
              <td className="px-4 py-2">
                {c.motif ?? "—"}
              </td>
              <td className="px-4 py-2">
                {c.medecin?.noms ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
