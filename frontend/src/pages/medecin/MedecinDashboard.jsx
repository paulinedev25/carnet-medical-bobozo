import { NavLink, Outlet } from "react-router-dom";

export default function MedecinDashboard() {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-blue-700 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-blue-500">
          🧑‍⚕️ Tableau Médecin
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavLink to="/dashboard/consultations" className="block p-2 hover:bg-blue-600">
            📋 Consultations
          </NavLink>
          <NavLink to="/dashboard/examens" className="block p-2 hover:bg-blue-600">
            🧪 Examens
          </NavLink>
          <NavLink to="/dashboard/prescriptions" className="block p-2 hover:bg-blue-600">
            💊 Prescriptions
          </NavLink>
        </nav>

        <button
          onClick={logoutUser}
          className="m-4 bg-red-600 hover:bg-red-700 p-2 rounded"
        >
          Déconnexion
        </button>

      </aside>

      <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
