import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import PrivateRoute from "./auth/PrivateRoute";

import LoginPage from "./pages/LoginPage";
import Unauthorized from "./pages/Unauthorized";
import Accueil from "./pages/Accueil";

import DashboardRouter from "./pages/DashboardRouter";

import UsersPage from "./pages/admin/UsersPage";
import PatientsPage from "./pages/admin/PatientsPage";
import ConsultationsPage from "./pages/admin/ConsultationsPage";
import ExamensPage from "./pages/admin/ExamensPage";
import MedicamentsPage from "./pages/admin/MedicamentsPage";
import PrescriptionsPage from "./pages/admin/PrescriptionsPage";
import HospitalisationRouter from "./pages/admin/HospitalisationRouter";
import CarnetMedicalPage from "./pages/admin/CarnetMedicalPage";
import ProfilePage from "./pages/ProfilePage";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer position="top-right" autoClose={3000} />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Accueil />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Routes under Dashboard */}
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
            {/* Dashboard Index */}
            <Route
              index
              element={<div className="p-6">Bienvenue sur le Carnet Médical</div>}
            />

            {/* Admin & Team Pages */}
            <Route path="patients" element={<PatientsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="consultations" element={<ConsultationsPage />} />
            <Route path="examens" element={<ExamensPage />} />
            <Route path="hospitalisations/*" element={<HospitalisationRouter />} />
            <Route path="medicaments" element={<MedicamentsPage />} />
            <Route path="prescriptions" element={<PrescriptionsPage />} />

            {/* Carnet Médical (Dynamic with patientId) */}
            <Route
              path="carnet/:patientId"
              element={<CarnetMedicalPage />}
            />

            {/* Profile Page */}
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Catch All */}
          <Route path="*" element={<Unauthorized />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
