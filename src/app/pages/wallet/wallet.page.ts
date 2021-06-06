import { Component, OnInit } from "@angular/core";
import { AlertController } from "@ionic/angular";
import { PaymentService } from "src/app/services/payment.service";

@Component({
  selector: "app-wallet",
  templateUrl: "./wallet.page.html",
  styleUrls: ["./wallet.page.scss"],
})
export class WalletPage implements OnInit {
  showNext = true;
  loading = false;
  amount;
  txRef;
  walletBalance: number;
  interval;
  transactions = [];
  loadingActivities = true

  constructor(
    public paymentService: PaymentService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.loadingActivities = true
    this.fetchWalletBalance();
    this.walletTransactions();
    this.interval = setInterval(() => this.fetchWalletBalance(), 15000);
  }

  ionViewDidLeave() {
    this.amount = null;
    this.walletBalance = null;
    clearInterval(this.interval);
  }

  generatePayment() { }

  async fetchWalletBalance() {
    // console.log("fetching wallet balance");

    const walletBalance = await this.paymentService.fetchWalletBalance();
    if (typeof walletBalance !== "boolean") {
      this.walletBalance = walletBalance;
    }
  }

  walletTransactions() {
    // this.loadingActivities = true
    this.paymentService.fetchWalletTransactions().subscribe((data) => {
      this.transactions = data
      this.loadingActivities = false
    })

  }

  async initTransaction() {
    this.showNext = true;
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
      this.loading = false;
      this.showNext = true;
      return;
    }

    this.txRef = tx["reference"];
    this.amount = tx["amount"];
    setTimeout(() => {
      this.amount = 0;
      this.txRef = "";
      this.loading = false;
      this.showNext = true;
    }, 15000);

    this.showNext = false;
    this.loading = false;
  }
}
