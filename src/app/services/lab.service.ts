import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { IAPIResponse } from "src/interfaces/general";
import { LabEvent, LoadLabRequests } from "../actions/events/lab";
import { LabState } from "../actions/states/lab";
import { GeneralService } from "./general.service";

@Injectable({
  providedIn: "root",
})
export class LabService {
  currentValues = {
    labRequests: new BehaviorSubject<Record<string, any>[]>(null),
    loadingLabRequests: new BehaviorSubject(null),
  };

  currentState: BehaviorSubject<LabState> = new BehaviorSubject<LabState>(
    LabState
  );

  constructor(private _genService: GeneralService) {
    this._genService.broadcaster.subscribe((result) => {
      if (!result) return;
      if (result.failed) return console.log("Request failed!");
      this.handleEvent(result.action, result.res);
    });
  }

  normalizeLabData(data: any[]) {
    const result = [];

    data.forEach((element) => {
      element?.requests?.forEach((request) => {
        console.log(request);
        const modified: Record<string, any> = {
          _id: element._id,
          appointment: element.appointment,
          raised_by: element.raised_by,
          is_follow_up: element.is_follow_up,
          diagnosis: element.diagnosis,
          created_at: element.created_at,
          updated_at: element.updated_at,
          result: request.test?.result,
          service_name: request.test?.service_name,
          service_category: request.test?.service_category,
          service_cost: request.test?.service_cost,
          service_department_route: request.test?.service_department_route,
          smart_code: request.test?.smart_code,
        };
        result.push(modified);
      });
    });
    console.log(result);
    return result;
  }

  triggerEvent(event: LabEvent, data?) {
    if (event === LoadLabRequests) {
      this.currentValues.loadingLabRequests.next(true);
      this._genService.getData({
        url: "hospital/patient-request",
        params: { action: "FETCH_PATIENT_LAB_REQUESTS" },
        action: event,
      });
      // this._genService.getData("hospital/patient-request?action=FETCH_PATIENT_LAB_REQUESTS", {})
    }
  }

  private readonly handleEvent = (
    event: LabEvent,
    value: IAPIResponse<Record<string, any> | Record<string, any>[]>
  ) => {
    if (event === LoadLabRequests) {
      this.currentValues.loadingLabRequests.next(false);
      if (Array.isArray(value.result)) {
        this.currentValues.labRequests.next(
          this.normalizeLabData(value.result)
        );
      } else {
        throw "LAB: RESPONSE FORMAT IS INVALID";
      }
    }
  };

  resetValue() {
    Object.keys(this.currentValues).forEach((key) => {
      if (!this.currentValues[key].closed) {
        this.currentValues[key].unsubscribe();
      }
    });

    this.currentValues = {
      labRequests: new BehaviorSubject([]),
      loadingLabRequests: new BehaviorSubject(false),
    };
  }
}
