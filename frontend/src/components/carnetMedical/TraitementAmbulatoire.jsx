import React from "react";
import PrescriptionTable from "./PrescriptionTable";
import RendezVousTable from "./RendezVousTable";
import { Button } from "@chakra-ui/react";

export default function TraitementAmbulatoire({ consultation }) {
  return (
    <div>
      <h3>Prescriptions</h3>
      <PrescriptionTable prescriptions={consultation.prescriptions} />

      {consultation.rendez_vous?.length > 0 && (
        <>
          <h3>Rendez-vous de suivi</h3>
          <RendezVousTable rendezVous={consultation.rendez_vous} />
          <Button onClick={() => console.log("Ajouter rendez-vous")}>+ Nouveau rendez-vous</Button>
        </>
      )}
    </div>
  );
}
