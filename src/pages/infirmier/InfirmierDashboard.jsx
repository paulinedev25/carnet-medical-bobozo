import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function InfirmierDashboard() {
  const { logoutUser, user } = useAuth();

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-green-700 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-green-500">
          🩺 Infirmier
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavLink to="soins" className="block p-2 rounded hover:bg-green-600">
            💉 Soins
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
