import { Component, OnInit } from "@angular/core";
import { LoadRadiologyRequests } from "src/app/actions/events/radiology";
import { RadiologyService } from "src/app/services/radiology.service";
import { Location } from "@angular/common"

@Component({
  selector: "app-radiology",
  templateUrl: "./radiology.page.html",
  styleUrls: ["./radiology.page.scss"],
})
export class RadiologyPage implements OnInit {
  constructor(public rService: RadiologyService, public location: Location) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.rService.triggerEvent(LoadRadiologyRequests);
  }
  goBack(){
    this.location.back()
  }
}
