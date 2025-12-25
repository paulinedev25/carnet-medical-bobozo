// src/pages/DashboardRouter.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

import AdminDashboard from "./admin/AdminDashboard";
import MedecinDashboard from "./medecin/MedecinDashboard";
import PharmacienDashboard from "./pharmacie/PharmacienDashboard";
import ReceptionnisteDashboard from "./receptionniste/ReceptionnisteDashboard";
import LaboDashboard from "./labo/LaboDashboard"; // ✅ ton dashboard labo
import InfirmierDashboard from "./infirmier/InfirmierDashboard";
import SecretaireDashboard from "./secretaire/SecretaireDashboard";

export default function DashboardRouter() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  switch (user.role?.toLowerCase()) {
    case "admin":
      return <AdminDashboard />;
    case "medecin":
      return <MedecinDashboard />;
    case "pharmacien":
      return <PharmacienDashboard />;
    case "receptionniste":
      return <ReceptionnisteDashboard />;
    case "laborantin": // ✅ on appelle le bon dashboard
      return <LaboDashboard />;
    case "infirmier":
      return <InfirmierDashboard />;
    case "secretaire":
      return <SecretaireDashboard />;
    default:
      return (
        <div className="p-6">
          <h1 className="text-lg font-bold text-red-500">
            🚫 Rôle inconnu : {user.role}
          </h1>
          <p>Contactez l'administrateur pour obtenir les droits d'accès.</p>
        </div>
      );
  }
}
