import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";
import { IAPIResponse } from "src/interfaces/general";
import { IHospital } from "src/interfaces/hospital";
import { HospitalEvent, LoadHospitals } from "../actions/events/hospital";
import { HospitalState } from "../actions/states/hospital";
import { GeneralService } from "./general.service";

@Injectable({
  providedIn: "root",
})
export class HospitalService {
  tempHospital: IHospital;
  currentValues = {
    hospitals: new BehaviorSubject<Record<string, any>[]>(null),
    loadingHospitals: new BehaviorSubject(null),
  };

  currentState: BehaviorSubject<HospitalState> =
    new BehaviorSubject<HospitalState>(HospitalState);

  constructor(private _genService: GeneralService) {
    this._genService.broadcaster.subscribe((result) => {
      if (!result) return;
      if (result.failed) return console.log("Request failed!");
      this.handleEvent(result.action, result.res);
    });
  }

  async triggerEvent(event: HospitalEvent, data?) {
    if (event === LoadHospitals) {
      this.currentValues.loadingHospitals.next(true);
      const loadedHospitals = this._genService.getData({
        url: "hospital/fetch-hospitals",
        params: {},
        action: event,
      });
      // this._genService.getData("hospital/patient-request?action=FETCH_PATIENT_LAB_REQUESTS", {})
      if (Array.isArray(loadedHospitals)) {
        loadedHospitals.forEach((element) => {
          this.transformHospitalData(element);
        });
        this.currentValues.hospitals.next(loadedHospitals);
      }
      this.currentValues.loadingHospitals.next(false);
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
  registerInHospital(patient: any, hospital: IHospital): Observable<any> {
    return this._genService.http.post(
      `${this._genService.baseUrl}hospital/patient-request`,
      { data: patient },
      {
        params: {
          action: "REGISTER_PATIENT",
          hospitla_smart_code: hospital.smart_code,
        },
      }
    );
  }

  transformHospitalData(hospital) {
    if (hospital.smartCode) {
      hospital.smart_code = hospital.smartCode;
    }
  }
}
