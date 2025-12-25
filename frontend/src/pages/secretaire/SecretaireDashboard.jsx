import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function SecretaireDashboard() {
  const { logoutUser, user } = useAuth();

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-purple-700 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-purple-500">
          📑 Secrétaire
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="documents"
            className="block p-2 rounded hover:bg-purple-600"
          >
            📂 Documents
          </NavLink>
        </nav>
        <button
          onClick={logoutUser}
          className="m-4 bg-red-600 p-2 rounded hover:bg-red-700"
        >
          Déconnexion
        </button>
      </aside>
      <main className="flex-1 bg-gray-50 p-6">
        <h1 className="text-xl font-semibold mb-4">
          Bienvenue {user?.noms}
        </h1>
        <Outlet />
      </main>
    </div>
  );
}
