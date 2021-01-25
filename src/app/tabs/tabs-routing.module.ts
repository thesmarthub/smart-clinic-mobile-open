import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";

const routes: Routes = [
  {
    path: "",
    component: TabsPage,
    children: [
      {
        path: "home",
        loadChildren: () =>
          import("../pages/home/home.module").then((m) => m.HomePageModule),
      },
      {
        path: "view-appointments",
        loadChildren: () =>
          import("../pages/view-appointments/view-appointments.module").then(
            (m) => m.ViewAppointmentsPageModule
          ),
      },
      {
        path: "prescription",
        loadChildren: () =>
          import("../pages/prescription/prescription.module").then(
            (m) => m.PrescriptionPageModule
          ),
      },
      {
        path: "lab",
        loadChildren: () =>
          import("../pages/lab/lab.module").then((m) => m.LabPageModule),
      },
      {
        path: "radiology",
        loadChildren: () =>
          import("../pages/radiology/radiology.module").then(
            (m) => m.RadiologyPageModule
          ),
      },
      {
        path: "hospitals",
        loadChildren: () =>
          import("../pages/hospitals/hospitals.module").then(
            (m) => m.HospitalsPageModule
          ),
      },
      {
        path: "",
        redirectTo: "/tabs/home",
        pathMatch: "full",
      },
    ],
  },
  {
    path: "",
    redirectTo: "/tabs/home",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
