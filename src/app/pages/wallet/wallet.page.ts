import { Component, OnInit } from "@angular/core";
import { AlertController } from "@ionic/angular";
import { PaymentService } from "src/app/services/payment.service";

@Component({
  selector: "app-wallet",
  templateUrl: "./wallet.page.html",
  styleUrls: ["./wallet.page.scss"],
})
export class WalletPage implements OnInit {
  loading = true;
  amount;
  txRef;
  constructor(
    public paymentService: PaymentService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  generatePayment() {}

  async initTransaction() {
    this.loading = true;
    const tx = await this.paymentService
      .generateTxRef([], { action: "UPDATE_SMART_WALLET", amount: this.amount })
      .then((data) => data);
    if (tx["error"]) {
      (
        await this.alertCtrl.create({
          message: tx["message"] ?? "Something went wrong",
          buttons: ["Ok"],
        })
      ).present();
      return;
    }

    this.txRef = tx["reference"];
    this.amount = tx["amount"];
    setTimeout(() => {
      this.amount = 0;
      this.txRef = "";
      this.loading = true;
    }, 15000);

    this.loading = false;
  }
}
