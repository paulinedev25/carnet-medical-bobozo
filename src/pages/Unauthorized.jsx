export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow text-center">
        <h2 className="text-xl font-bold mb-2">Accès refusé</h2>
        <p>Vous n'êtes pas autorisé à accéder à cette ressource.</p>
      </div>
    </div>
  );
}
