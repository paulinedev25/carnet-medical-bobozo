// src/pages/ProfilePage.jsx
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { updateUser } from "../api/users";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const { user, token, loginUser } = useAuth();
  const [form, setForm] = useState({
    noms: user?.noms || "",
    email: user?.email || "",
    mot_de_passe: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await updateUser(token, user.id, form);
      toast.success("✅ Profil mis à jour avec succès");
      // 🔄 mettre à jour le contexte Auth (important pour refléter les changements)
      loginUser({ token, utilisateur: updated });
    } catch (err) {
      console.error("Erreur mise à jour profil:", err);
      toast.error(err.response?.data?.error || "Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">👤 Mon Profil</h2>
      <p className="text-gray-600 mb-6">
        Connecté en tant que <b>{user?.role}</b>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nom complet</label>
          <input
            type="text"
            name="noms"
            value={form.noms}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Nouveau mot de passe</label>
          <input
            type="password"
            name="mot_de_passe"
            value={form.mot_de_passe}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Laisser vide pour ne pas changer"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Mise à jour..." : "Mettre à jour"}
        </button>
      </form>
    </div>
  );
}
