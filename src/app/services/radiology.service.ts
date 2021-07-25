import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { IAPIResponse } from "src/interfaces/general";
import {
  LoadRadiologyRequests,
  RadiologyEvent,
} from "../actions/events/radiology";
import { LoadingRadiologyRequests, RadiologyState } from "../actions/states/radiology";
import { GeneralService } from "./general.service";

@Injectable({
  providedIn: "root",
})
export class RadiologyService {
  currentValues = {
    radiologyRequests: new BehaviorSubject<Record<string, any>[]>(null),
    loadingRadiologyRequests: new BehaviorSubject(null),
  };

  currentState: BehaviorSubject<RadiologyState> = new BehaviorSubject<RadiologyState>(
    RadiologyState
  );

  constructor(private _genService: GeneralService) {
    this._genService.broadcaster.subscribe((result) => {
      if (!result) return;
      if (result.failed) return console.log("Request failed!");
      this.handleEvent(result.action, result.res);
    });
  }

  normalizeRadiologyData(data: any[]) {
    const result = [];

    data.forEach((element) => {
      element?.requests?.forEach((request) => {
        // console.log(request);
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
          completed:element.completed
        };
        result.push(modified);
      });
    });
    console.log(result);
    return result;
  }

  triggerEvent(event: RadiologyEvent, data?) {
    if (event === LoadRadiologyRequests) {
      this.currentValues.loadingRadiologyRequests.next(true)
      this._genService.getData({
        url: "hospital/patient-request",
        params: { action: "FETCH_PATIENT_RADIOLOGY_REQUESTS" },
        action: event,
      });
      // this._genService.getData("hospital/patient-request?action=FETCH_PATIENT_LAB_REQUESTS", {})
    }
  }

  sendRadResults(data: any) {
    this._genService.postDataNodeBackend(data)
     // console.log(data);
   }

  private readonly handleEvent = (
    event: RadiologyEvent,
    value: IAPIResponse<Record<string, any> | Record<string, any>[]>
  ) => {
    if (event === LoadRadiologyRequests) {
      this.currentValues.loadingRadiologyRequests.next(false);
      if (Array.isArray(value.result)) {
        this.currentValues.radiologyRequests.next(
          this.normalizeRadiologyData(value.result)
         
        );
      } else {
        throw "RADIOLOGY: RESPONSE FORMAT IS INVALID";
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
      radiologyRequests: new BehaviorSubject([]),
      loadingRadiologyRequests: new BehaviorSubject(false),
    };
  }
}
