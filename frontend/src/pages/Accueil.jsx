// src/pages/Accueil.jsx
import { useNavigate } from "react-router-dom";

export default function Accueil() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 via-white to-blue-50">
      {/* Logo + Nom système */}
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Logo hôpital */}
        <img
          src="/logo-hopital.png" // ⚠️ place ton logo dans public/logo-hopital.png
          alt="Logo hôpital"
          className="w-24 h-24 mb-4"
        />
        <h1 className="text-3xl font-bold text-green-800">
          🏥 Carnet Médical Numérique
        </h1>
        <p className="text-gray-600 max-w-md">
          Bienvenue dans le système de prise en charge numérique des malades militaires à l'Hôpital Militaire de BOBOZO.
        </p>
      </div>

      {/* Bouton Se connecter */}
      <button
        onClick={() => navigate("/login")}
        className="mt-8 px-6 py-3 bg-green-700 hover:bg-green-800 text-white text-lg font-semibold rounded-2xl shadow-lg transition-transform transform hover:scale-105"
      >
        🔑 Se connecter
      </button>

      {/* Footer infos */}
      <footer className="absolute bottom-4 text-center text-gray-500 text-sm">
        <p>Version 1.0.0</p>
        <p>&copy; {new Date().getFullYear()} Hôpital Régional Militaire – Tous droits réservés</p>
      </footer>
    </div>
  );
}
