import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext"; // Assure que AuthContext expose logoutUser

export default function MedecinDashboard() {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  const handleLogout = () => {
    logoutUser(); // Déconnexion propre
    navigate("/login");
  };

  const navItems = [
    {
      to: "/dashboard/consultations",
      label: "Consultations",
      icon: "📋",
    },
    {
      to: "/dashboard/examens",
      label: "Examens",
      icon: "🧪",
    },
    {
      to: "/dashboard/prescriptions",
      label: "Prescriptions",
      icon: "💊",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-blue-800 text-white flex flex-col shadow-lg">
        {/* Header */}
        <div className="p-6 text-2xl font-extrabold border-b border-blue-700 flex items-center space-x-2">
          <span className="text-3xl">🧑‍⚕️</span>
          <span>Tableau Médecin</span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg font-medium transition-colors
                 ${
                   isActive
                     ? "bg-blue-600 text-white"
                     : "text-blue-100 hover:bg-blue-700 hover:text-white"
                 }`
              }
            >
              <span className="mr-2">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            🔓 Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
