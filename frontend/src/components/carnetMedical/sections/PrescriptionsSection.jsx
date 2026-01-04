// src/components/carnetMedical/sections/PrescriptionsSection.jsx
export default function PrescriptionsSection({ prescriptions }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Prescriptions</h3>
      {prescriptions?.length ? (
        <ul className="list-disc pl-5">
          {prescriptions.map((p) => (
            <li key={p.id}>
              {new Date(p.date).toLocaleDateString("fr-FR")} - {p.medicament} - {p.posologie}
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucune prescription</p>
      )}
    </div>
  );
}
