import { Injectable } from "@angular/core";
import {
  PrescriptionState,
  LoadedPrescriptions,
  LoadingPrescriptions,
} from "../actions/states/prescription";
import {
  PrescriptionEvent,
  LoadPrescriptions,
} from "../actions/events/prescription";
import { BehaviorSubject, Observable } from "rxjs";
import { GeneralService } from "./general.service";

@Injectable({
  providedIn: "root",
})
export class PrescriptionService {
  currentValues: { [param: string]: BehaviorSubject<any> } = {};

  private currentState: BehaviorSubject<PrescriptionState> = new BehaviorSubject(
    new PrescriptionState()
  );

  constructor(private _genService: GeneralService) {
    this.initValues();
  }

  normalizePrescriptionData = (arr: { [param: string]: any }[]) => {
    const results: object[] = [];
    arr?.forEach((data: { [param: string]: any }) => {
      data?.drugs?.forEach((drug) => {
        results.push({
          appointment: data.appointment,
          created_at: data.created_at,
          d_o_b: data.d_o_b,
          department: data.department,
          diagnosis: data.diagnosis,
          direct_prescription: data.direct_prescription,
          quantity: drug.quantity,
          dispensed: drug.dispensed,
          bill_generated: false,
          department_route: drug?.drug?.department_route,
          item_cost: drug?.drug?.item_cost,
          drug_class: drug?.drug?.drug_class,
          item_category_name: drug?.drug?.item_category_name,
          item_name: drug?.drug?.item_name,
          item_unit: drug?.drug?.item_unit,
          smart_code: drug?.drug?.smart_code,
          injection: drug?.injection,
          general_instruction: data?.general_instruction,
          is_follow_up: data.is_follow_up,
          raised_by: data?.raised_by,
          status: data?.status,
          updated_at: data?.updated_at,
          verified_status: data?.verified_status,
          _id: data?._id,
        });
      });
    });
    return results;
  };

  callbackRunner = async (
    callback: Observable<object>,
    state: PrescriptionState
  ) => {
    this.currentValues.loading.next(true);
    const result = await callback.subscribe(
      (data: { [param: string]: [] }) => {
        if (state === LoadingPrescriptions) {
          this.currentValues.prescriptions.next(
            this.normalizePrescriptionData(data?.result)
          );

          this.currentState.next(new LoadedPrescriptions());

          console.log(this.currentValues);
        }
        data?.result;
      },
      (err) => {
        console.log("Prescription API call failed!", err);
      },
      () => {
        this.currentValues.loading.next(false);
      }
    );
  };

  handleEvent = async (event: PrescriptionEvent, value?) => {
    console.log("handling events");
    if (event instanceof LoadPrescriptions) {
      console.log("Loading Prescriptions");
      this.currentState.next(new LoadingPrescriptions());
      this.callbackRunner(
        await this._genService.getData(
          "hospital/patient-request?action=FETCH_PATIENT_PRESCRIPTIONS"
        ),
        LoadingPrescriptions
      ) ?? [];
    }
  };

  initValues() {
    Object.keys(this.currentValues).forEach((key) => {
      if (!this.currentValues[key].closed) {
        this.currentValues[key].unsubscribe();
      }
    });

    this.currentValues = {
      prescriptions: new BehaviorSubject([]),
      loading: new BehaviorSubject(false),
    };
  }
}
