import { NavLink, Outlet } from "react-router-dom";

export default function PharmacienDashboard() {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-green-700 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-green-500">
          💊 Tableau Pharmacien
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavLink to="/dashboard/medicaments" className="block p-2 hover:bg-green-600">
            📦 Gestion Médicaments
          </NavLink>
          <NavLink to="/dashboard/prescriptions" className="block p-2 hover:bg-green-600">
            🚚 Livraison Prescriptions
          </NavLink>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
