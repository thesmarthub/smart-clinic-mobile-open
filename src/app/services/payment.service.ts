import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AlertController } from "@ionic/angular";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import {
  FetchBills,
  InitiatePayment,
  PaymentEvent,
} from "../actions/events/payment";
import {
  FetchedBills,
  FetchingBills,
  InitiatedPayment,
  InitiatingPayment,
  PaymentState,
} from "../actions/states/payment";
import { Store } from "../engine/store";
import { GeneralService } from "./general.service";

@Injectable({
  providedIn: "root",
})
export class PaymentService {
  currentValues = {
    pendingBills: new BehaviorSubject([]),
    paidBills: new BehaviorSubject([]),
    loadingBills: new BehaviorSubject(false),
    initiatingPayment: new BehaviorSubject(false),
  };

  currentState = new BehaviorSubject(PaymentState);
  store = new Store();
  creatingLink = false;

  constructor(
    private gService: GeneralService,
    private _http: HttpClient,
    private alertCtrl: AlertController
  ) {
    this.gService.broadcaster.subscribe((data) => {
      if (!data) return;
      this.handleEvent(data.action, data.res);
    });
  }

  triggerEvent(event: PaymentEvent, value?: any) {
    if (event === FetchBills) {
      this.currentState.next(FetchingBills);
      this.currentValues.loadingBills.next(true);
      this.gService.getData({
        url: "hospital/patient-request",
        params: value,
        action: event,
      });
    }
    if (event === InitiatePayment) {
      this.currentState.next(InitiatingPayment);
      this.currentValues.initiatingPayment.next(true);
      this.gService.postData({
        url: "payment/flutterwave/init",
        data: {},
        action: PaymentEvent,
      });
    }
  }

  filterBills(bills: any[]) {
    if (!bills) {
      return {
        paidBills: [],
        pendingBills: [],
      };
    }
    return {
      paidBills: bills?.filter((bill) => bill.payment_status === true),
      pendingBills: bills?.filter((bill) => bill.payment_status === false),
    };
  }

  attachBills(val) {
    const bills = this.filterBills(val);

    console.log("bills", bills);
    this.currentValues.paidBills.next(bills.paidBills);
    this.currentValues.pendingBills.next(bills.pendingBills);
    this.currentState.next(FetchedBills);
  }

  generateTxRef = async (bills: number[]) => {
    return await this.gService.http
      .post(`${this.gService.baseUrl}payment/generate-transaction-ref`, {
        bills,
      })
      .pipe(map((data) => data))
      .toPromise()
      .then((data) => data);
  };

  private handleEvent(event: PaymentEvent, value?: any) {
    if (event === FetchBills) {
      this.currentValues.loadingBills.next(false);
      this.attachBills(value?.result);
    }

    if (event === InitiatePayment) {
      this.currentValues.initiatingPayment.next(false);
      this.currentState.next(InitiatedPayment);
    }
  }

  async payNow({ cart, redirectUrl }) {
    console.log(cart);
    this.creatingLink = true;
    localStorage.setItem("after_payment", "/home/payment/pending");
    // const redirectUrl = window.location.origin + '/home/payment/paid-cons';

    // const paymentURL = `${this.gService.baseUrl}payment/flutterwave/`;
    const paymentURL = "http://localhost:7004/flutterwave/";
    const billIds = cart.map((bill) => {
      return bill.id;
    });
    const amount = cart.reduce((prevValue, cartItem) => {
      return (
        prevValue + cartItem.amount_paid_per_unit * cartItem.number_of_units
      );
    }, 0);
    this._http
      .post(
        `${paymentURL}init?redirect_url=${redirectUrl}&amount=${amount}&email=${this.store.user.email}&patient_name=${this.store.userFullName}&phone=${this.store.user.phone}`,
        { bills: billIds }
      )
      .subscribe(
        async (res) => {
          if (res && res["result"] && res["result"]["data"]) {
            window.location.href =
              res["result"]["data"]["authorization_url"] ??
              res["result"]["data"]["link"];
          } else {
            console.log(res);
            const alert = await this.alertCtrl.create({
              message: "Could not initiate payment",
              header: "Payment Error",
              buttons: ["OK"],
            });
            await alert.present();
          }
        },
        async (err) => {
          console.log(err);
          const alert = await this.alertCtrl.create({
            message: "Please check your connection",
            header: "Payment Error",
            buttons: ["OK"],
          });
          await alert.present();
        },
        () => (this.creatingLink = false)
      );
  }
}
