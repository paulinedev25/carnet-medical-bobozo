// src/components/carnetMedical/sections/ConsultationsSection.jsx
export default function ConsultationsSection({ consultations }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Consultations</h3>
      {consultations?.length ? (
        <ul className="list-disc pl-5">
          {consultations.map((c) => (
            <li key={c.id}>
              {new Date(c.date).toLocaleDateString("fr-FR")} - {c.motif}
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucune consultation</p>
      )}
    </div>
  );
}
