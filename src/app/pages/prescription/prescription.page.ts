import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { LoadPrescriptions } from "src/app/actions/events/prescription";
import { PaymentService } from "src/app/services/payment.service";
import { PrescriptionService } from "src/app/services/prescription.service";
import { Location } from "@angular/common"

@Component({
  selector: "app-prescription",
  templateUrl: "./prescription.page.html",
  styleUrls: ["./prescription.page.scss"],
})
export class PrescriptionPage implements OnInit {
  // onlyDrugs = new BehaviorSubject(false)
  constructor(public pService: PrescriptionService,
    public router: Router,
     public paymentService: PaymentService,
     public Location: Location) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.pService.triggerEvent(LoadPrescriptions);
    this.payForDrugs
  }

  payForDrugs() {
    this.router.navigate(['/tabs/payment'], {
      queryParams: {
        department_route: 'pharmacy'
      }
    })
  }

  goBack() {
    this.Location.back()
  }
}
