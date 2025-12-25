import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const SidebarLink = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block p-2 rounded flex items-center gap-2 ${
        isActive ? "bg-blue-600" : "hover:bg-blue-600"
      }`
    }
  >
    {children}
  </NavLink>
);

export default function AdminDashboard() {
  const { user, logoutUser } = useAuth();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-blue-500">
          Carnet Médical
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <SidebarLink to="patients">🧑‍⚕️ Patients</SidebarLink>
            </li>
            <li>
              <SidebarLink to="consultations">📋 Consultations</SidebarLink>
            </li>

            {/* Examens */}
            <li>
              <SidebarLink to="examens">🧪 Examens</SidebarLink>
            </li>

            <li>
              <SidebarLink to="hospitalisations">🏥 Hospitalisations</SidebarLink>
            </li>

            {/* Médicaments */}
            <li>
              <SidebarLink to="medicaments">💊 Médicaments</SidebarLink>
            </li>

            {/* ✅ NOUVEAU LIEN PRESCRIPTIONS */}
            <li>
              <SidebarLink to="prescriptions">📑 Prescriptions</SidebarLink>
            </li>

            <li>
              <SidebarLink to="rapports">📊 Rapports SNIS</SidebarLink>
            </li>
            <li>
              <SidebarLink to="users">👥 Gestion des utilisateurs</SidebarLink>
            </li>
            <li>
              <SidebarLink to="settings">⚙️ Paramètres</SidebarLink>
            </li>
          </ul>
        </nav>

        <button
          onClick={logoutUser}
          className="m-4 bg-red-600 hover:bg-red-700 p-2 rounded"
        >
          Déconnexion
        </button>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 flex flex-col bg-gray-50">
        <header className="flex justify-between items-center bg-white shadow px-6 py-4">
          <h1 className="text-xl font-semibold">
            Bienvenue, {user?.noms || "Admin"}
          </h1>
          <p className="text-gray-600">
            Connecté en tant que <b>{user?.role}</b>
          </p>
        </header>

        {/* Ici s'affichent les sous-pages */}
        <section className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
