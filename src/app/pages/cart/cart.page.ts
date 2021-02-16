import { Component, OnInit } from "@angular/core";
import { AlertController, ModalController } from "@ionic/angular";
import { Store } from "src/app/engine/store";
import { CartService } from "src/app/services/cart.service";
import { PaymentService } from "src/app/services/payment.service";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.page.html",
  styleUrls: ["./cart.page.scss"],
})
export class CartPage implements OnInit {
  publicKey = "FLWPUBK-c5b9e8583d786c4f157dc1cd2801662b-X";
  customerDetails = {};
  customizations = {};
  meta = {};
  txRef;
  amount;
  cart: any[] = [];
  store = new Store();
  transactionInitiated = false;

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.cart = this.cartService.getCart();
    this.customerDetails = {
      name: this.store.userFullName,
      email: this.store.user.email,
      phone_number: this.store.user.phone,
    };
  }

  ionViewDidEnter() {
    this.initTransaction();
  }

  decreaseCartItem(product) {
    this.cartService.decreaseProduct(product);
  }

  increaseCartItem(product) {
    this.cartService.addProduct(product);
  }

  removeCartItem(product) {
    this.cartService.removeProduct(product);
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
    if (this.cart.length < 1) {
      this.modalCtrl.dismiss();
      return;
    }
    const tx = await this.paymentService
      .generateTxRef(this.cart.map((data) => data.id))
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
  }

  async makePaymentCallback(event) {
    console.log("Payment completed!", event);
  }

  closedPaymentModal() {
    console.log("Modal closed");
    this.modalCtrl.dismiss({ reload: true });
  }

  async checkout() {
    // Perfom PayPal or Stripe checkout process

    let alert = await this.alertCtrl.create({
      header: "Thanks for your Order!",
      message: "We will deliver your food as soon as possible",
      buttons: ["OK"],
    });
    alert.present().then(() => {
      this.modalCtrl.dismiss();
    });
  }
}
