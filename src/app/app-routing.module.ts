import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "auth/login",
    pathMatch: "full",
  },
  {
    path: "auth",
    loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
  },
  // {
  //   path: "home",
  //   loadChildren: () =>
  //     import("./pages/home/home.module").then((m) => m.HomePageModule),
  // },
  {
    path: "tabs",
    loadChildren: () =>
      import("./tabs/tabs.module").then((m) => m.TabsPageModule),
  },
  {
    path: 'view-appointments',
    loadChildren: () => import('./pages/view-appointments/view-appointments.module').then( m => m.ViewAppointmentsPageModule)
  },
  {
    path: 'calendar',
    loadChildren: () => import('./pages/calendar/calendar.module').then( m => m.CalendarPageModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./pages/payment/payment.module').then( m => m.PaymentPageModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./pages/cart/cart.module').then( m => m.CartPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./pages/chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'please-wait',
    loadChildren: () => import('./pages/please-wait/please-wait.module').then( m => m.PleaseWaitPageModule)
  },
  {
    path: 'pandemic',
    loadChildren: () => import('./pages/pandemic/pandemic.module').then( m => m.PandemicPageModule)
  },
  {
    path: 'hospital-reg',
    loadChildren: () => import('./pages/hospital-reg/hospital-reg.module').then( m => m.HospitalRegPageModule)
  },
  {
    path: 'user-profile',
    loadChildren: () => import('./pages/user-profile/user-profile.module').then( m => m.UserProfilePageModule)
  },
  {
    path: 'doctors',
    loadChildren: () => import('./pages/doctors/doctors.module').then( m => m.DoctorsPageModule)
  },
  {
    path: 'wallet',
    loadChildren: () => import('./pages/wallet/wallet.module').then( m => m.WalletPageModule)
  },
  {
    path: 'ambulance',
    loadChildren: () => import('./pages/ambulance/ambulance.module').then( m => m.AmbulancePageModule)
  },
  {
    path: 'video-chat',
    loadChildren: () => import('./pages/video-chat/video-chat.module').then( m => m.VideoChatPageModule)
  },
  {
    path: 'flutterwave',
    loadChildren: () => import('./pages/flutterwave/flutterwave.module').then( m => m.FlutterwavePageModule)
  },
  {
    path: 'onboarding',
    loadChildren: () => import('./pages/onboarding/onboarding.module').then( m => m.OnboardingPageModule)
  },
  {
    path: 'start-screen',
    loadChildren: () => import('./pages/start-screen/start-screen.module').then(m => m.StartScreenPageModule)
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
