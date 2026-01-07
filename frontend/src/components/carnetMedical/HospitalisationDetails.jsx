import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@components/ui/tabs";
import SoinsTable from "./SoinsTable";
import PrescriptionTable from "./PrescriptionTable";
import ExamenTable from "./ExamenTable";
import BilletSortieDetails from "./BilletSortieDetails";

export default function HospitalisationDetails({ hospitalisation }) {
  return (
    <Tabs defaultValue="soins">
      <TabsList>
        <TabsTrigger value="soins">Soins infirmiers</TabsTrigger>
        <TabsTrigger value="examens">Examens</TabsTrigger>
        <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        <TabsTrigger value="billetSortie">Billet de sortie</TabsTrigger>
      </TabsList>

      <TabsContent value="soins">
        <SoinsTable hospitalisationId={hospitalisation.id} />
      </TabsContent>

      <TabsContent value="examens">
        <ExamenTable hospitalisationId={hospitalisation.id} />
      </TabsContent>

      <TabsContent value="prescriptions">
        <PrescriptionTable prescriptions={hospitalisation.prescriptions} />
      </TabsContent>

      <TabsContent value="billetSortie">
        <BilletSortieDetails billet={hospitalisation.billet_sortie} />
      </TabsContent>
    </Tabs>
  );
}
