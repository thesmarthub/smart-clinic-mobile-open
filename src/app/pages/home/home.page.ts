import { Component, OnInit } from "@angular/core";
import { Store } from "src/app/engine/store";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit {
  cards = [
    {
      title: "appointments",
      icon: "fa fa-calendar",
      link: "/tabs/view-appointments",
      img: "/assets/004-calendar.png",
    },
    {
      title: "bills",
      icon: "fa fa-wallet",
      link: "/tabs/payment",
      img: "/assets/payment.png",
    },
    {
      title: "prescriptions",
      icon: "fa fa-prescription",
      link: "/tabs/prescription",
      img: "/assets/001-drug.png",
    },
    {
      title: "laboratory",
      icon: "fa fa-vials",
      link: "/tabs/lab",
      img: "/assets/003-research.png",
    },
    {
      title: "scans",
      icon: "fa fa-x-ray",
      link: "/tabs/radiology",
      img: "/assets/ante_natal.png",
    },
    {
      title: "hospitals",
      icon: "fa fa-building",
      link: "/tabs/hospitals",
      img: "/assets/012-hospital-1.png",
    },
  ];

  store = new Store()
  constructor() {}

  ngOnInit() {
    console.log("Home Page loaded");
  }
}
