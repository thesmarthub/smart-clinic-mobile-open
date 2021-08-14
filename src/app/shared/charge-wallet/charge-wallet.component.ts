import { Component, OnInit, Input } from "@angular/core";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-charge-wallet",
  templateUrl: "./charge-wallet.component.html",
  styleUrls: ["./charge-wallet.component.scss"],
})
export class ChargeWalletComponent implements OnInit {
  @Input() callback;
  constructor(private _alertCtrl: AlertController) {}

  ngOnInit() {}

  async chargeWallet() {
    const alertCtrl2 = await this._alertCtrl.create({
      header: "Starting Consultation",
      message: `550 units will be deducted from your wallet for this transaction. <br> Do you want to proceed?`,
      buttons: [
        {
          text: "Yes",
          role: "cancel",
          cssClass: "secondary",
          handler: this.callback
        },
        {
          text: "No",
          handler: () => {},
        },
      ],
    });
  }
}
