import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Store } from "./engine/store";
import { Router } from "@angular/router";
import { TabsService } from "./services/tabs.service";
import { CloseMenu } from "./actions/events/tab";

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
    private tabService: TabsService
  ) {
    this.initializeApp();
  }

  closeTab() {
    this.tabService.triggerEvent(CloseMenu);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  logout() {
    this.closeTab();
    this.store.clearStore();
    this.router.navigateByUrl("/auth/login");
  }
}
