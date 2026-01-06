import React from "react";
import { Button } from "@chakra-ui/react";

export default function ConsultationsTable({ consultations, viewDetails }) {
  return (
    <table className="table-auto w-full border">
      <thead>
        <tr>
          <th>Date</th>
          <th>Médecin</th>
          <th>Décision</th>
          <th>Détails</th>
        </tr>
      </thead>
      <tbody>
        {consultations.map(c => (
          <tr key={c.id} className="border-t">
            <td>{new Date(c.date_consultation).toLocaleDateString()}</td>
            <td>{c.medecin?.noms}</td>
            <td>{c.decision_medicale}</td>
            <td>
              <Button size="sm" onClick={() => viewDetails(c)}>Voir détails</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
