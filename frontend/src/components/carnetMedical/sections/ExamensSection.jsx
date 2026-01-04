// src/components/carnetMedical/sections/ExamensSection.jsx
export default function ExamensSection({ examens }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Examens</h3>
      {examens?.length ? (
        <ul className="list-disc pl-5">
          {examens.map((e) => (
            <li key={e.id}>
              {new Date(e.date).toLocaleDateString("fr-FR")} - {e.type} - {e.resultat || "En attente"}
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun examen</p>
      )}
    </div>
  );
}
