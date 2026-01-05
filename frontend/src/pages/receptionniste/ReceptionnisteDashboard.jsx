import { NavLink, Outlet } from "react-router-dom";

export default function ReceptionnisteDashboard() {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-purple-700 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-purple-500">
          🏥 Tableau Réceptionniste
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavLink to="/dashboard/patients" className="block p-2 hover:bg-purple-600">
            🧑‍⚕️ Patients
          </NavLink>
          <NavLink to="/dashboard/consultations" className="block p-2 hover:bg-purple-600">
            📋 Consultations
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
