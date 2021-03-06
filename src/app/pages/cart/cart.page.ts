import { Component, OnDestroy, OnInit } from "@angular/core";
import { AlertController, ModalController } from "@ionic/angular";
import { BehaviorSubject, Subscription } from "rxjs";
import { Store } from "src/app/engine/store";
import { CartService } from "src/app/services/cart.service";
import { PaymentService } from "src/app/services/payment.service";
import { WalletChargeDirective } from "src/app/shared/wallet-charge.directive";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.page.html",
  styleUrls: ["./cart.page.scss"],
})
export class CartPage implements OnInit, OnDestroy {
  publicKey = "FLWPUBK-c5b9e8583d786c4f157dc1cd2801662b-X";
  customerDetails = {};
  customizations = {};
  meta = {};
  txRef;
  amount;
  cart: any[] = [];
  store = new Store();
  transactionInitiated = false;
  redirectUrl = "/validate-payment";
  verifyingPayment = false;
  readyToPay = false;
  loading = true;

  subs: Subscription[] = [];

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private walletChargeDirective: WalletChargeDirective
  ) {}

  ngOnInit() {
    this.cartService.cartModal = this.modalCtrl;
    this.cart = this.cartService.getCart();
    this.customerDetails = {
      name: this.store.userFullName,
      email: this.store.user.email,
      phone_number: this.store.user.phone,
    };
    const sub1 = this.paymentService.currentValues.afterPayment.subscribe(
      (data) => {
        if (data) {
          this.verifyingPayment = true;
          this.paymentService.verifyPayment(data);
          this.paymentService.clean("afterPayment");
        }
      }
    );
    const sub2 = this.paymentService.currentValues.afterVerification.subscribe(
      (data) => {
        if (data) {
          this.verifyingPayment = false;
          if (!data?.failed) {
            this.closedPaymentModal();
          }
          this.paymentService.clean("afterVerification");
        }
      }
    );
    this.subs.push(sub1, sub2);
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => {
      if (!sub.closed) {
        sub.unsubscribe();
      }
    });
  }

  ionViewDidEnter() {
    // if (this.getTotal() < 1) {
    this.initTransaction();
    // }
  }

  decreaseCartItem(product) {
    this.cartService.decreaseProduct(product);
  }

  increaseCartItem(product) {
    this.cartService.addProduct(product);
  }

  removeCartItem(product) {
    this.transactionInitiated = false;
    this.cartService.removeProduct(product);
    this.initTransaction();
  }

  getTotal() {
    return this.cart.reduce(
      (i, j) => i + j.amount_paid_per_unit * j.number_of_units,
      0
    );
  }

  close() {
    this.modalCtrl.dismiss();
  }

  async initTransaction() {
    this.loading = true;
    if (this.cart.length < 1) {
      this.modalCtrl.dismiss({ reload: false });
      return;
    }
    const tx = await this.paymentService
      .generateTxRef(
        this.cart.map((data) => data.id),
        {
          action: "UPDATE_BILLS",
        }
      )
      .then((data) => data);
    if (tx["error"]) {
      (
        await this.alertCtrl.create({
          message: tx["message"] ?? "Something went wrong",
          buttons: ["Ok"],
        })
      ).present();
      this.modalCtrl.dismiss();
      return;
    }
    if (tx["code"] === "CLEARED") {
      this.cartService.clearCart();
      const alert = await this.alertCtrl.create({
        header: "Payment Verification",
        message: "Selected Bills have been cleared!",
        buttons: ["OK"],
      });
      alert.present().then(() => {
        this.closedPaymentModal();
      });
    }
    this.txRef = tx["reference"];
    this.amount = tx["amount"];
    this.transactionInitiated = true;
    this.loading = false;
  }

  async makePaymentCallback(event) {
    console.log("Payment completed!", event);
  }

  closedPaymentModal() {
    console.log("Modal closed");
    this.modalCtrl.dismiss({ reload: true });
  }

  payWithWallet() {
    this.walletChargeDirective.runMe({amount: this.amount})
  }
}
