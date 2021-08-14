import { APP_INITIALIZER, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy, RouterModule } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GeneralInterceptorService } from "./interceptors/general-interceptor";
import { CalendarModule } from "ion2-calendar";
import { FlutterwaveModule } from "flutterwave-angular-v3";
import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
// import { KeycloakAngularModule, KeycloakService } from "keycloak-angular";

// function initializeKeycloak(keycloak: KeycloakService) {
//   return () =>
//     keycloak.init({
//       config: {
//         url: "http://localhost:8081/auth",
//         realm: "clinic",
//         clientId: "vanilla",
//       },
//       initOptions: {
//         onLoad: "check-sso",
//         silentCheckSsoRedirectUri:
//           window.location.origin + "/assets/silent-check-sso.html",
//       },
//     });
// }
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    FlutterwaveModule,
    // KeycloakAngularModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AndroidPermissions,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GeneralInterceptorService,
      multi: true,
    },
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: initializeKeycloak,
    //   multi: true,
    //   deps: [KeycloakService],
    // },
    InAppBrowser,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
