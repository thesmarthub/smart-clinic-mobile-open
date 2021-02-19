import { Component } from "@angular/core";

import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Store } from "./engine/store";
import { Router } from "@angular/router";
import { TabsService } from "./services/tabs.service";
import { CloseMenu } from "./actions/events/tab";

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from "@capacitor/core";

const { PushNotifications } = Plugins;

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  store = new Store();
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private tabService: TabsService,
    private androidPermissions: AndroidPermissions
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermission().then((result) => {
      if (result.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener(
      "registration",
      (token: PushNotificationToken) => {
        this.store.firebaseToken = token.value;
        // alert("Push registration success, token: " + token.value);
        console.log("Push notification enabled!");
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener("registrationError", (error: any) => {
      // alert("Error on registration: " + JSON.stringify(error));
      console.log("Could not register push notifications");
    });

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener(
      "pushNotificationReceived",
      (notification: PushNotification) => {
        // alert("Push received: " + JSON.stringify(notification));
        console.log("Push received: " + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener(
      "pushNotificationActionPerformed",
      (notification: PushNotificationActionPerformed) => {
        // alert("Push action performed: " + JSON.stringify(notification));
        console.log("Push action performed: " + JSON.stringify(notification));
      }
    );
  }

  closeTab() {
    this.tabService.triggerEvent(CloseMenu);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.androidPermissions
        .checkPermission(this.androidPermissions.PERMISSION.CAMERA)
        .then(
          (result) => console.log("Has permission?", result.hasPermission),
          (err) =>
            this.androidPermissions.requestPermission(
              this.androidPermissions.PERMISSION.CAMERA
            )
        );

      this.androidPermissions.requestPermissions([
        this.androidPermissions.PERMISSION.CAMERA,
        this.androidPermissions.PERMISSION.GET_ACCOUNTS,
        this.androidPermissions.PERMISSION.INTERNET,
      ]);
    });
  }

  logout() {
    this.closeTab();
    this.store.clearStore();
    this.router.navigateByUrl("/auth/login");
  }
}
