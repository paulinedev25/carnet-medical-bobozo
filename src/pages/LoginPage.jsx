// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 🔑 Envoi au backend
      const data = await login(email, motDePasse);
      console.log("Réponse API login =>", data);

      if (!data?.utilisateur?.role || !data?.token) {
        setError("⚠️ Impossible de récupérer les informations de l'utilisateur.");
        setLoading(false);
        return;
      }

      // ✅ Sauvegarde complète dans le context
      loginUser(data);

      // ✅ Redirection vers le dashboard correspondant au rôle
      navigate("/dashboard"); // DashboardRouter choisira le dashboard correct
    } catch (err) {
      console.error("Erreur login:", err);
      setError(err.response?.data?.error || "Identifiants incorrects");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white shadow-lg rounded w-96"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          Carnet Médical - Connexion
        </h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-2 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full mb-4 p-2 border rounded"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          disabled={loading}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
