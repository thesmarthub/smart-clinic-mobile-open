import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AlertController } from "@ionic/angular";
import * as moment from "moment";
import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { APIResult } from "src/interfaces/api";
import { PaymentAction } from "src/interfaces/payment";
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
  readonly currentValues = {
    pendingBills: new BehaviorSubject([]),
    paidBills: new BehaviorSubject([]),
    loadingBills: new BehaviorSubject(false),
    initiatingPayment: new BehaviorSubject(false),
    afterPayment: new BehaviorSubject(null),
    afterVerification: new BehaviorSubject(null),
  };

  currentState = new BehaviorSubject(PaymentState);
  store = new Store();
  creatingLink = false;
  departmentRoute = null;

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
      if (!value) {
        value = {
          action: "FETCH_PATIENT_BILLS",
          start_date: moment().subtract(3, "months").toDate(),
        };
      }
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
        drugBills: [],
      };
    }
    return {
      paidBills: bills?.filter((bill) => {
        if (
          this.departmentRoute &&
          bill.department_route !== this.departmentRoute
        ) {
          return false;
        }
        return bill.payment_status === true;
      }),
      pendingBills: bills?.filter((bill) => {
        if (
          this.departmentRoute &&
          bill.department_route !== this.departmentRoute
        ) {
          return false;
        }
        return bill.payment_status === false;
      }),
    };
  }

  attachBills(val) {
    const bills = this.filterBills(val);

    console.log("bills", bills);
    this.currentValues.paidBills.next(bills.paidBills);
    this.currentValues.pendingBills.next(bills.pendingBills);
    this.currentState.next(FetchedBills);
  }

  generateTxRef = async (
    bills: number[],
    { action, amount }: { action: PaymentAction; amount?: number }
  ) => {
    return await this.gService.http
      .post(
        `${this.gService.baseUrl}payment/generate-transaction-ref`,
        {
          bills,
        },
        {
          params: {
            amount: String(amount),
            action,
          },
        }
      )
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

  verifyPayment(queryParams) {
    this._http
      .get(
        `${this.gService.baseUrl}payment/flutterwave/verify?tx_ref=${queryParams.tx_ref}&transaction_id=${queryParams.transaction_id}&platform=${queryParams.platform}&status=${queryParams.status}`,
        {
          params: {
            hospital_smart_code: queryParams.hospital_smart_code,
            patient_smart_code: queryParams.patient_smart_code,
          },
        }
      )
      .subscribe(
        (res: any) => {
          if (res && res?.result) {
            this.currentValues.afterVerification.next(res);
          } else {
            this.currentValues.afterVerification.next({
              message: "Could not validate payment. Please try again later.",
              failed: true,
            });
          }
        },
        (err) => {
          console.log(err);
          this.currentValues.afterVerification.next({
            message: "Something went wrong",
            failed: true,
          });
        }
      );
  }

  async fetchWalletBalance() {
    return await this.gService.http
      .get<APIResult<number>>(`${this.gService.baseUrl}payment/wallet-balance`)
      .pipe(map((data) => data.result))
      .toPromise()
      .then((data) => data)
      .catch((e) => false);
  }

  fetchWalletTransactions() {
    return this._http
      .get<APIResult<object[]>>(
        `${this.gService.baseUrl}payment/patient-transactions`,
        { params: { action: "UPDATE_SMART_WALLET" } }
      )
      .pipe(
        map((data) =>
          data.result.filter((res: Record<string, any>) => {
            return res.action === "UPDATE_SMART_WALLET";
          })
        )
      );
  }

  clean(prop) {
    if (Object.keys(this.currentValues).includes(prop)) {
      this.currentValues[prop].next(null);
    }
  }

  typeGenerator() {
    return "aftermath";
  }
}
