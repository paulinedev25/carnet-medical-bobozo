export default function PrescriptionTable({ prescriptions }) {
  return (
    <table>
      <thead>
        <tr><th>Médicament</th><th>Quantité</th><th>Posologie</th></tr>
      </thead>
      <tbody>
        {prescriptions.map(p => (
          <tr key={p.id}>
            <td>{p.medicament?.nom}</td>
            <td>{p.quantite}</td>
            <td>{p.posologie}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
