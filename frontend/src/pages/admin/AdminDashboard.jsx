import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

const SidebarLink = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `block p-2 rounded flex items-center gap-2 transition-colors ${
        isActive
          ? "bg-blue-600 text-white"
          : "text-blue-100 hover:bg-blue-500 hover:text-white"
      }`
    }
  >
    {children}
  </NavLink>
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-blue-800 text-white flex flex-col shadow-lg">
        <div className="p-6 text-2xl font-bold border-b border-blue-700 flex items-center gap-2">
          <span className="text-3xl">📋</span>
          <span>Admin</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <ul>
            <li>
              <SidebarLink to="patients">🧑‍⚕️ Patients</SidebarLink>
            </li>
            <li>
              <SidebarLink to="consultations">📋 Consultations</SidebarLink>
            </li>
            <li>
              <SidebarLink to="examens">🧪 Examens</SidebarLink>
            </li>
            <li>
              <SidebarLink to="hospitalisations">🏥 Hospitalisations</SidebarLink>
            </li>
            <li>
              <SidebarLink to="medicaments">💊 Médicaments</SidebarLink>
            </li>
            <li>
              <SidebarLink to="prescriptions">📑 Prescriptions</SidebarLink>
            </li>
            <li>
              <SidebarLink to="users">👥 Gestion des utilisateurs</SidebarLink>
            </li>
            <li>
              <SidebarLink to="settings">⚙️ Paramètres</SidebarLink>
            </li>
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition"
          >
            🔓 Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center bg-white shadow px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-800">
            Bienvenue, {user?.noms || "Admin"}
          </h1>
          <p className="text-gray-600">
            Connecté en tant que <b>{user?.role || "administrateur"}</b>
          </p>
        </header>

        {/* Content */}
        <section className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
