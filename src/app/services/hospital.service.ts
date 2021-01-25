import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { IAPIResponse } from "src/interfaces/general";
import { HospitalEvent, LoadHospitals } from "../actions/events/hospital";
import { HospitalState } from "../actions/states/hospital";
import { GeneralService } from "./general.service";

@Injectable({
  providedIn: "root",
})
export class HospitalService {
  currentValues = {
    hospitals: new BehaviorSubject<Record<string, any>[]>(null),
    loadingHospitals: new BehaviorSubject(null),
  };

  currentState: BehaviorSubject<HospitalState> = new BehaviorSubject<HospitalState>(
    HospitalState
  );

  constructor(private _genService: GeneralService) {
    this._genService.broadcaster.subscribe((result) => {
      if (!result) return;
      if (result.failed) return console.log("Request failed!");
      this.handleEvent(result.action, result.res);
    });
  }

  triggerEvent(event: HospitalEvent, data?) {
    if (event === LoadHospitals) {
      this.currentValues.loadingHospitals.next(true);
      this._genService.getData({
        url: "hospital/fetch-hospitals",
        params: {},
        action: event,
      });
      // this._genService.getData("hospital/patient-request?action=FETCH_PATIENT_LAB_REQUESTS", {})
    }
  }

  private readonly handleEvent = (
    event: HospitalEvent,
    value: IAPIResponse<Record<string, any> | Record<string, any>[]>
  ) => {
    if (event === LoadHospitals) {
      this.currentValues.loadingHospitals.next(false);
      if (Array.isArray(value.result)) {
        this.currentValues.hospitals.next(value.result);
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
      hospitals: new BehaviorSubject([]),
      loadingHospitals: new BehaviorSubject(false),
    };
  }
}
