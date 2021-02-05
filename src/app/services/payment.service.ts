import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import {
  FetchBills,
  InitiatePayment,
  PaymentEvent,
} from "../actions/events/payment";
import {
  FetchedBills,
  FetchingBills,
  InitiatedPayment,
  PaymentState,
} from "../actions/states/payment";
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

  constructor(private gService: GeneralService) {
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
}
