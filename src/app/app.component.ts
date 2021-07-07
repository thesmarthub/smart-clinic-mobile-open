import { Component, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { Platform } from "@ionic/angular";

import { AndroidPermissions } from "@ionic-native/android-permissions/ngx";

import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Store } from "./engine/store";
import { TabsService } from "./services/tabs.service";
import { CloseMenu } from "./actions/events/tab";

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from "@capacitor/core";
import { PaymentService } from "./services/payment.service";
const { PushNotifications, App } = Plugins;

import * as Url from "url-parse";
import { ChatService } from "./services/chat.service";
import { Client } from "@stomp/stompjs";
import * as SockJS from "sockjs-client";
import { ChatRequest } from "./models/chat-request";

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
    private paymentService: PaymentService,
    private chatService: ChatService,
    private androidPermissions: AndroidPermissions,
    private zone: NgZone
  ) {
    this.initializeApp();
    // this.chatService.whatsAppTest();
  }

  ngOnInit() {
    if (this.store.notNeedLogin) {
      this.router.navigate(["/tabs/home"]);
    }
    console.log("Initializing app!");
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

    App.addListener("appUrlOpen", (data: any) => {
      this.zone.run(() => {
        // Example url: https://beerswift.app/tabs/tab2
        // slug = /tabs/tab2
        const url = new Url(data.url, true);
        if (url?.query?.action === "payment") {
          this.paymentService.currentValues.afterPayment.next(url.query);
        }
        // const slug = data.url.split(".app").pop();
        // if (slug) {
        //   alert(slug);
        //   this.router.navigateByUrl(slug);
        // }
        // If no match, do nothing - let regular routing
        // logic take over
      });
    });
  }

  logout() {
    this.closeTab();
  
    if (
      this.store.activeChatDoctor &&
      !confirm(
        "You have an existing conversation. This conversation will be cancelled."
      )
    ) {
      return;
    }
    setTimeout(() => {
      this.store.clearStore();
        if(!this.store.userType){
      this.router.navigateByUrl('/start-screen')
    }else{

      this.router.navigateByUrl("/auth/login");
    }

    }, 1000)
  }

  navigateToResetPassword() {
    this.closeTab();
    this.router.navigate(["/auth/reset-password"], {
      queryParams: {
        from_menu: "yes",
      },
    });
  }
}
