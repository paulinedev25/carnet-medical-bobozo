// src/pages/admin/HospitalisationRouter.jsx
import { Routes, Route } from "react-router-dom";
import HospitalisationPage from "./HospitalisationPage";
import HospitalisationDetails from "./HospitalisationDetails";
import HospitalisationForm from "./HospitalisationForm";

export default function HospitalisationRouter() {
  return (
    <Routes>
      {/* Liste par défaut */}
      <Route index element={<HospitalisationPage />} />

      {/* Formulaire d'ajout */}
      <Route path="nouveau" element={<HospitalisationForm />} />

      {/* Détails */}
      <Route path=":id" element={<HospitalisationDetails />} />
    </Routes>
  );
}
