import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-please-wait",
  templateUrl: "./please-wait.page.html",
  styleUrls: ["./please-wait.page.scss"],
})
export class PleaseWaitPage implements OnInit {
  constructor(
    private router: Router,
    private aRoute: ActivatedRoute,
    private _http: HttpClient,
    private alertCtrl: AlertController
  ) {
    this.aRoute.queryParams.subscribe((data) => {
      if (data.tx_ref) {
        this.verifyPayment(data.tx_ref);
      }
    });
  }

  ngOnInit() {}

  verifyPayment(referenceCode) {
    if (!referenceCode) {
      alert("No reference found for transaction");
      this.router.navigateByUrl("/");
    }
    this._http
      .post(`${environment.baseURL}payment/paystack/verify`, {
        reference: referenceCode,
      })
      .subscribe(async (res) => {
        if (res) {
          const alert = await this.alertCtrl.create({
            header: "Payment Verification",
            message: res["message"],
            buttons: ["OK"],
          });
          await alert.present().then(() => {
            this.router.navigateByUrl("/tabs/payment");
          });
        }
      });
  }
}
