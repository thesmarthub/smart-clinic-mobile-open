import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../services/auth.guard";
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
          // canActivate: [AuthGuard]
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
        path: "payment",
        loadChildren: () =>
          import("../pages/payment/payment.module").then(
            (m) => m.PaymentPageModule
          ),
      },
      {
        path: "doctors",
        loadChildren: () =>
          import("../pages/doctors/doctors.module").then(
            (m) => m.DoctorsPageModule
          ),
      },
      {
        path: "ambulance",
        loadChildren: () =>
          import("../pages/ambulance/ambulance.module").then(
            (m) => m.AmbulancePageModule
          ),
      },
      {
        path: "wallet",
        loadChildren: () =>
          import("../pages/wallet/wallet.module").then(
            (m) => m.WalletPageModule
          ),
      },
      {
        path: "market-place",
        loadChildren: () => import("../pages/market-place/market-place.module").then((m)=>m.MarketPlacePageModule)
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
