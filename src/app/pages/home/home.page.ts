import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit {
  cards = [
    {
      title: "Appointments",
      icon: "fa fa-calendar",
      link: "/tabs/appointment",
      img: "/assets/004-calendar.png",
    },
    {
      title: "Payments",
      icon: "fa fa-wallet",
      link: "/tabs/payment",
      img: "/assets/payment.png",
    },
    {
      title: "Prescriptions",
      icon: "fa fa-prescription",
      link: "/tabs/prescription",
      img: "/assets/001-drug.png",
    },
    {
      title: "Laboratory",
      icon: "fa fa-vials",
      link: "/tabs/lab",
      img: "/assets/003-research.png",
    },
    {
      title: "Scans",
      icon: "fa fa-x-ray",
      link: "/tabs/radiology",
      img: "/assets/ante_natal.png",
    },
    {
      title: "Change Hospital",
      icon: "fa fa-building",
      link: "/tabs/hospitals",
      img: "/assets/012-hospital-1.png",
    },
  ];

  constructor() {}

  ngOnInit() {
    console.log("Home Page loaded");
  }
}
