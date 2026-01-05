// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import PrivateRoute from "./auth/PrivateRoute";

import LoginPage from "./pages/LoginPage";
import Unauthorized from "./pages/Unauthorized";
import Accueil from "./pages/Accueil"; // ✅ Page publique

import DashboardRouter from "./pages/DashboardRouter";

import UsersPage from "./pages/admin/UsersPage";
import PatientsPage from "./pages/admin/PatientsPage";
import ConsultationsPage from "./pages/admin/ConsultationsPage";
import ExamensPage from "./pages/admin/ExamensPage";
import MedicamentsPage from "./pages/admin/MedicamentsPage";
import PrescriptionsPage from "./pages/admin/PrescriptionsPage";
import HospitalisationRouter from "./pages/admin/HospitalisationRouter";
import CarnetMedicalPage from "./pages/carnetMedical/CarnetMedicalPage";
import ProfilePage from "./pages/ProfilePage";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        {/* ✅ Notifications globales */}
        <ToastContainer position="top-right" autoClose={3000} />

        <Routes>
          {/* 🏠 Page d'accueil publique */}
          <Route path="/" element={<Accueil />} />

          {/* 🔓 Routes publiques */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* 🔐 Dashboard */}
          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute
                allowedRoles={[
                  "admin",
                  "medecin",
                  "pharmacien",
                  "receptionniste",
                  "laborantin",
                  "infirmier",
                  "secretaire",
                ]}
              >
                <DashboardRouter />
              </PrivateRoute>
            }
          >
            {/* Accueil dashboard */}
            <Route
              index
              element={
                <div>
                  <h2 className="text-lg font-bold mb-4">Tableau de bord</h2>
                  <p>Bienvenue sur le Carnet Médical.</p>
                </div>
              }
            />

            {/* 👥 Patients */}
            <Route
              path="patients"
              element={
                <PrivateRoute allowedRoles={["admin", "receptionniste", "medecin", "infirmier"]}>
                  <PatientsPage />
                </PrivateRoute>
              }
            />

            {/* 👤 Utilisateurs */}
            <Route
              path="users"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <UsersPage />
                </PrivateRoute>
              }
            />

            {/* 📝 Consultations */}
            <Route
              path="consultations"
              element={
                <PrivateRoute allowedRoles={["admin", "receptionniste", "medecin"]}>
                  <ConsultationsPage />
                </PrivateRoute>
              }
            />

            {/* 🔬 Examens */}
            <Route
              path="examens"
              element={
                <PrivateRoute allowedRoles={["admin", "medecin", "laborantin"]}>
                  <ExamensPage />
                </PrivateRoute>
              }
            />

            {/* 🏥 Hospitalisations */}
            <Route
              path="hospitalisations/*"
              element={
                <PrivateRoute allowedRoles={["admin", "medecin", "infirmier"]}>
                  <HospitalisationRouter />
                </PrivateRoute>
            }
            />

            {/* 💊 Médicaments */}
            <Route
              path="medicaments"
              element={
                <PrivateRoute allowedRoles={["admin", "pharmacien"]}>
                  <MedicamentsPage />
                </PrivateRoute>
              }
            />

            {/* 📑 Prescriptions */}
            <Route
              path="prescriptions"
              element={
                <PrivateRoute allowedRoles={["admin", "medecin", "pharmacien"]}>
                  <PrescriptionsPage />
                </PrivateRoute>
              }
            />
          </Route>
          
          <Route path="carnet/:patientId" element={<CarnetMedicalPage />} />

          {/* 👤 Profil */}
          <Route
            path="/profile"
            element={
              <PrivateRoute
                allowedRoles={[
                  "admin",
                  "medecin",
                  "pharmacien",
                  "receptionniste",
                  "laborantin",
                  "infirmier",
                  "secretaire",
                ]}
              >
                <ProfilePage />
              </PrivateRoute>
            }
          />

          {/* 🔄 Par défaut */}
          <Route path="*" element={<Unauthorized />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
