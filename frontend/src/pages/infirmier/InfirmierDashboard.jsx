import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function InfirmierDashboard() {
  const navigate = useNavigate();
  const { logoutUser, user } = useAuth();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const navItems = [
    {
      to: "soins",
      label: "Soins infirmiers",
      icon: "💉",
    },
    {
      to: "constantes-vitales",
      label: "Constantes vitales",
      icon: "📊",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-green-800 text-white flex flex-col shadow-lg">
        {/* Header */}
        <div className="p-6 text-2xl font-bold border-b border-green-700 flex items-center space-x-2">
          <span className="text-3xl">🧑‍⚕️</span>
          <span>Espace Infirmier</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-green-600 text-white"
                    : "text-green-100 hover:bg-green-700 hover:text-white"
                }`
              }
            >
              <span className="mr-2">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-green-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            🔓 Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Bienvenue {user?.noms || "Infirmier"}
          </h1>
          <p className="text-gray-600">Choisissez une option dans le menu</p>
        </div>

        {/* Place where nested routes are rendered */}
        <Outlet />
      </main>
    </div>
  );
}
