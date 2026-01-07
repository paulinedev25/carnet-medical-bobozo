export default function PatientInfo({ patient }) {
  return (
    <div>
      <h1>{patient.noms}</h1>
      <p>Age: {patient.age}</p>
      <p>Sexe: {patient.sexe}</p>
      <p>ID: {patient.id}</p>
    </div>
  );
}
