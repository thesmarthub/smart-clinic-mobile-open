import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'

@Component({
  selector: 'app-health-shop',
  templateUrl: './health-shop.page.html',
  styleUrls: ['./health-shop.page.scss'],
})
export class HealthShopPage implements OnInit {

  cards = [
    {
      title: "Urinalysis",
      icon: "fa fa-calendar",
      amount: 1500,
      img: "/assets/014-options.png",
      bgColor: "appt",
    },
    {
      title: "Panadol",
      icon: "fa fa-user",
      amount: 1500,
      img: "/assets/014-options.png",
      bgColor: "doctors",
    },
    {
      title: "Inhaler",
      icon: "fa fa-prescription",
      amount: 1500,
      img: "/assets/014-options.png",
      bgColor: "doctors",
    },
    {
      title: "Gloves",
      icon: "fa fa-prescription",
      amount: 1500,
      img: "/assets/014-options.png",
      bgColor: "doctors",
    },
    {
      title: "Hand Sanitizer",
      icon: "fa fa-prescription",
     amount: 1500,
      img: "/assets/014-options.png",
      bgColor: "doctors",
    },
  ]

  categories = [
    {
      title: "Drugs",
      icon: "fa fa-calendar",
      link: "/tabs/view-appointments",
      img: "/assets/014-options.png",
      bgColor: "appt",
    },
    {
      title: "Lab Tests",
      icon: "fa fa-user",
      link: "/tabs/doctors",
      img: "/assets/014-options.png",
      bgColor: "doctors",
    },
    {
      title: "Scans",
      icon: "fa fa-calendar",
      link: "/tabs/view-appointments",
      img: "/assets/014-options.png",
      bgColor: "appt",
    },
    {
      title: "Others",
      icon: "fa fa-user",
      link: "/tabs/doctors",
      img: "/assets/014-options.png",
      bgColor: "doctors",
    },
    
  ]

  constructor(public location:Location) { }

  ngOnInit() {
  }

  slideOpts = {
    initialSlide: 0,
    speed: 100,
    freeMode:false,
    autoplay: {
      delay: 5000,
    },
    
  };

  goBack(){
    this.location.back()
  }

}
