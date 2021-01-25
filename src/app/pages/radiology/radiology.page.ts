import { Component, OnInit } from "@angular/core";
import { LoadRadiologyRequests } from "src/app/actions/events/radiology";
import { RadiologyService } from "src/app/services/radiology.service";

@Component({
  selector: "app-radiology",
  templateUrl: "./radiology.page.html",
  styleUrls: ["./radiology.page.scss"],
})
export class RadiologyPage implements OnInit {
  constructor(public rService: RadiologyService) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.rService.triggerEvent(LoadRadiologyRequests);
  }
}
