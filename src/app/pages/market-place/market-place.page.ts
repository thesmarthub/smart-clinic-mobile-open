import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'

@Component({
  selector: 'app-market-place',
  templateUrl: './market-place.page.html',
  styleUrls: ['./market-place.page.scss'],
})
export class MarketPlacePage implements OnInit {

  toShow="drugs";

  drugs = [
    {
      drug_name: "Paracetmol",
      drug_price: "500.00"
    },
    {
      drug_name: "Ceptrin",
      drug_price: "900.00"
    },
    {
      drug_name: "Aretesunate",
      drug_price: "1500.00"
    }
  ];

  services = [
    {
      service_name:"radiology",
      cost: "3000.00"
    },
    {
      service_name:"malaria",
      cost: "2000.00"
    },
    {
      service_name:"pcv",
      cost: "1500.00"
    },

  ];

  constructor(public location:Location) { }

  ngOnInit() {
  }

  goBack(){
    this.location.back()
  }

  marketPurchase(element:string){
    console.log("market", element);
  }

}
