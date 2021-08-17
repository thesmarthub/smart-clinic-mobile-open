import { Component, OnInit } from "@angular/core";
import {
  AlertController,
  IonRouterOutlet,
  MenuController,
  Platform,
} from "@ionic/angular";
import { Store } from "src/app/engine/store";
import { TabsService } from "src/app/services/tabs.service";
import { OpenMenu, TabEvent } from "src/app/actions/events/tab";
import { Observer } from "rxjs";
import { App } from "@capacitor/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ChatService } from "src/app/services/chat.service";
import { CometChat } from "@cometchat-pro/chat";
import { GeneralService } from "src/app/services/general.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit {
  openMenu = OpenMenu;
  cards = [
    {
      title: "Appointments",
      icon: "fa fa-calendar",
      link: "/tabs/view-appointments",
      img: "/assets/004-calendar.png",
      bgColor: "appt",
      users: ["doctor", "user"],
    },
    {
      title: "Talk to Doctor",
      icon: "fa fa-user",
      link: "/tabs/doctors",
      img: "/assets/019-doctor.png",
      bgColor: "doctors",
      users: ["user"],
    },
    {
      title: "Prescriptions",
      icon: "fa fa-prescription",
      link: "/tabs/prescription",
      img: "/assets/001-drug.png",
      bgColor: "doctors",
      users: ["users"],
    },
    {
      title: "Laboratory",
      icon: "fa fa-vials",
      link: "/tabs/lab",
      img: "/assets/003-research.png",
      bgColor: "appt",
      users: ["users"],
    },
    {
      title: "Scans",
      icon: "fa fa-x-ray",
      link: "/tabs/radiology",
      img: "/assets/in_bed.png",
      bgColor: "appt",
      users: ["users"],
    },
    {
      title: "Hospitals",
      icon: "fa fa-building",
      link: "/tabs/hospitals",
      img: "/assets/012-hospital-1.png",
      bgColor: "doctors",
      users: ["users"],
    },
    // {
    //   title: "Market Place",
    //   icon: "fa fa-map-marker",
    //   link: "/tabs/market-place",
    //   img: "/assets/016-map.png",
    //   bgColor: "appt",
    //   users: ["users"],
    // }
  ];

  doctorsCards = [
    {
      title: "Appointments",
      icon: "fa fa-calendar",
      link: "/tabs/view-appointments",
      img: "/assets/004-calendar.png",
      bgColor: "appt",
    },
    {
      title: "Active Chats",
      icon: "fa fa-user",
      link: "/tabs/doctors",
      img: "/assets/021-comments.png",
      bgColor: "doctors",
    },
  ];

  store = new Store();
  backButton: Observer<any>;

  constructor(
    private menu: MenuController,
    private tService: TabsService,
    private platform: Platform,
    private alertCtrl: AlertController,
    private router: Router,
    private aRoute: ActivatedRoute,
    private _chatService: ChatService,
    private _genService: GeneralService
  ) {
    this.aRoute.queryParams.subscribe((data) => {
      if (data.endChat === "true") {
        this._genService.resetQueryParams(this.router, this.aRoute);
        CometChat.logout()
          .then((res) => console.log("logout chat", res))
          .catch((e) => console.log("logout chat err", e));
        const store = new Store();
        const isDoctor = store.userType === "doctor";
        if (!isDoctor) {
          this._chatService
            .runner(`users/${store.user._id}/friends`, "DELETE", {
              friends: [store.activeChatDoctor?._id],
            })
            .then((res) => res)
            .catch((e) => console.log(e, "unfriend error"));

          setTimeout(() => {
            store.activeChatDoctor = null;
          }, 3000);
        }
      }
    });
    this.tService.currentValues.menuAction.subscribe((action) => {
      if (action === "open") {
        this.openCustom();
      } else if (action === "close") {
        this.closeCustom();
      }
    });
    this.platform.backButton.subscribe(async () => {
      if (this.router.url === "/tabs/home") {
        await this.confirmExitApp();
        return;
      }
    });
  }

  ngOnInit() {
    if (
      !this.store.user ||
      (!this.store.currentHospital && this.store.userType !== "doctor")
    ) {
      this.router.navigate(["/auth/login"]);
    }
    console.log("Home Page loaded");
  }

  eventTrigger(event: TabEvent) {
    this.tService.triggerEvent(event);
  }

  openCustom() {
    this.menu.enable(true, "custom");
    this.menu.open("custom");
  }

  closeCustom() {
    this.menu.close();
  }

  async confirmExitApp() {
    const confirmAlert = await this.alertCtrl.create({
      cssClass: "custom-alert",
      header: "Exit App",
      message: "Are you sure you want to leave?",
      buttons: [
        {
          text: "No",
          handler: () => {
            confirmAlert.dismiss();
            return;
          },
        },
        {
          text: "Yes",
          handler: () => {
            navigator["app"].exitApp();
          },
        },
      ],
    });

    return await confirmAlert.present();
  }
}
