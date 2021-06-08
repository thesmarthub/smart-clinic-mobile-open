import { Component, OnInit } from "@angular/core";
import { MenuController } from "@ionic/angular";
import { Store } from "src/app/engine/store";
import { TabsService } from "src/app/services/tabs.service";
import { OpenMenu, TabEvent } from "src/app/actions/events/tab";

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
      bgColor: "appt"
    },
    {
      title: "Talk to Doctor",
      icon: "fa fa-user",
      link: "/tabs/doctors",
      img: "/assets/019-doctor.png",
      bgColor: "doctors"
    },
    {
      title: "Prescriptions",
      icon: "fa fa-prescription",
      link: "/tabs/prescription",
      img: "/assets/001-drug.png",
      bgColor: "doctors"
    },
    {
      title: "Laboratory",
      icon: "fa fa-vials",
      link: "/tabs/lab",
      img: "/assets/003-research.png",
      bgColor: "appt"
    },
    {
      title: "Scans",
      icon: "fa fa-x-ray",
      link: "/tabs/radiology",
      img: "/assets/in_bed.png",
      bgColor: "appt"
    },
    {
      title: "Hospitals",
      icon: "fa fa-building",
      link: "/tabs/hospitals",
      img: "/assets/012-hospital-1.png",
      bgColor: "doctors"
    },
  ];

  store = new Store()
  constructor(private menu: MenuController, private tService: TabsService) {
    this.tService.currentValues.menuAction.subscribe((action) => {
      if (action === "open") {
        this.openCustom();
      } else if (action === "close") {
        this.closeCustom();
      }
    })};

  ngOnInit() {
    console.log("Home Page loaded");
  }

  
  eventTrigger(event: TabEvent) {
    this.tService.triggerEvent(event)
  }

  openCustom() {
    this.menu.enable(true, "custom");
    this.menu.open("custom");
  }

  closeCustom() {
    this.menu.close("custom");
  }
}
