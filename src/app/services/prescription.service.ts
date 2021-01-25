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
import { IAPIResponse } from "src/interfaces/general";

@Injectable({
  providedIn: "root",
})
export class PrescriptionService {
  currentValues = {
    prescriptions: new BehaviorSubject<Record<string, any>[]>(null),
    loadingPrescriptions: new BehaviorSubject<boolean>(null),
  };

  private currentState: BehaviorSubject<PrescriptionState> = new BehaviorSubject(
    PrescriptionState
  );

  constructor(private _genService: GeneralService) {
    this._genService.broadcaster.subscribe((result) => {
      if (!result) return;
      if (result.failed) {
        return console.log(result.res);
      }
      this.handleEvent(result.action, result.res);
    });
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

  triggerEvent = async (event: PrescriptionEvent, value?) => {
    if (event === LoadPrescriptions) {
      this.currentState.next(LoadingPrescriptions);
      this.currentValues.loadingPrescriptions.next(true);
      this._genService.getData({
        url: "hospital/patient-request",
        action: event,
        params: { action: "FETCH_PATIENT_PRESCRIPTIONS" },
      });
    }
  };

  private readonly handleEvent = (
    event: PrescriptionEvent,
    value: IAPIResponse<Record<string, any> | Record<string, any>[]>
  ) => {
    if (event === LoadPrescriptions) {
      this.currentValues.loadingPrescriptions.next(false);
      if (Array.isArray(value.result)) {
        this.currentValues.prescriptions.next(
          this.normalizePrescriptionData(value.result)
        );
      } else {
        throw "PRESCRIPTIONS: RESPONSE FORMAT IS INVALID";
      }
    }
  };

  resetValues() {
    Object.keys(this.currentValues).forEach((key) => {
      if (!this.currentValues[key].closed) {
        this.currentValues[key].unsubscribe();
      }
    });

    this.currentValues = {
      prescriptions: new BehaviorSubject([]),
      loadingPrescriptions: new BehaviorSubject(false),
    };
  }
}
