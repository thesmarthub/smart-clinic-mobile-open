import { Component, OnInit } from "@angular/core";
import { LoadPrescriptions } from "src/app/actions/events/prescription";
import { PrescriptionService } from "src/app/services/prescription.service";

@Component({
  selector: "app-prescription",
  templateUrl: "./prescription.page.html",
  styleUrls: ["./prescription.page.scss"],
})
export class PrescriptionPage implements OnInit {
  constructor(public pService: PrescriptionService) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.pService.triggerEvent(LoadPrescriptions);
  }

  call(){
    window.open('08062190101');
  }
}
