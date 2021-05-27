import { Component, Input, OnInit } from "@angular/core";
import { Flutterwave, PaymentSuccessResponse } from "flutterwave-angular-v3";
import { Store } from "src/app/engine/store";

@Component({
  selector: "app-flutterwave",
  templateUrl: "./flutterwave.page.html",
  styleUrls: ["./flutterwave.page.scss"],
})
export class FlutterwavePage implements OnInit {
  @Input() action:
    | "UPDATE_BILLS"
    | "UPDATE_HOSPITAL_WALLET"
    | "UPDATE_SMART_WALLET" = "UPDATE_BILLS";

  @Input() amount
  @Input() transactionRef

  store = new Store();

  publicKey = "FLWPUBK-c5b9e8583d786c4f157dc1cd2801662b-X";

  customerDetails = {
    name: this.store.userFullName,
    email: this.store.user.email,
    phone_number: this.store.user.phone,
  };

  customizations = {
    title: "Smart Clinic Mobile",
    description: "Pay for items and services here.",
    logo: "https://flutterwave.com/images/logo-colored.svg",
  };

  meta = {
    hospital_number: this.store.user.hospital_number,
    patient_smart_code: this.store.user.smart_code,
    action: this.action,
  };

  constructor(private flutterwave: Flutterwave) {}

  ngOnInit() {
    if(!this.amount) {
      throw new Error("Amount is required!");
    }
    if(!this.transactionRef) {
      throw new Error("Transaction Ref is required!")
    }
    if(!this.action) {
      throw new Error("Action is require. 'UPDATE_BILLS', 'UPDATE_HOSPITAL_WALLET' or 'UPDATE_SMART_WALLET'")
    }
  }

  makePaymentCallback(response: PaymentSuccessResponse): void {
    console.log("Pay", response);
    this.flutterwave.closePaymentModal(5);
  }
  closedPaymentModal(): void {
    console.log("payment is closed");
  }
  generateReference(): string {
    let date = new Date();
    return date.getTime().toString();
  }
}
