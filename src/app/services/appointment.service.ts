import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ApiAction } from "src/interfaces/action";
import { IAPIResponse } from "src/interfaces/general";
import {
  AppointmentEvent,
  LoadAppointments,
  LoadTimeSlots,
} from "../actions/events/appointment";
import { AppointmentState } from "../actions/states/appointment";
import { departmentByRoute } from "../engine/department";
import { Store } from "../engine/store";
import { GeneralService } from "./general.service";

@Injectable({
  providedIn: "root",
})
export class AppointmentService {
  currentValues = {
    appointments: new BehaviorSubject<Record<string, any>[]>(null),
    loadingAppointments: new BehaviorSubject<boolean>(null),
    timeSlots: new BehaviorSubject<Record<string, any>[]>(null),
    loadingTimeSlots: new BehaviorSubject<boolean>(null),
  };

  currentState: BehaviorSubject<AppointmentState> = new BehaviorSubject<AppointmentState>(
    AppointmentState
  );

  constructor(private _genService: GeneralService) {
    this._genService.broadcaster.subscribe((result) => {
      this.handleEvent(result?.action, result?.res);
    });
  }

  normalizeAppointmentData(data: any[]) {
    return (
      data?.map((el) => {
        el.department = departmentByRoute({
          store: new Store(),
          route: el.department_route,
        });
        return el;
      }) || []
    );
  }

  triggerEvent(event: AppointmentEvent, data?) {
    if (event === LoadAppointments) {
      this.currentValues.loadingAppointments.next(true);
      this._genService.getData({
        url: "hospital/patient-request",
        params: { action: "FETCH_PATIENT_APPOINTMENTS" },
        action: event,
      });
      // this._genService.getData("hospital/patient-request?action=FETCH_PATIENT_LAB_REQUESTS", {})
    }
    if (event === LoadTimeSlots) {
      this.currentValues.loadingTimeSlots.next(true);
      const apiAction: ApiAction = "FETCH_TIME_SLOTS";
      this._genService.getData({
        url: "hospital/patient-request",
        params: { action: apiAction, ...data },
        action: LoadTimeSlots,
      });
    }
  }

  private readonly handleEvent = (
    event: AppointmentEvent,
    value: IAPIResponse<Record<string, any> | Record<string, any>[]>
  ) => {
    if (event === LoadAppointments) {
      this.currentValues.loadingAppointments.next(false);
      if (Array.isArray(value?.result)) {
        this.currentValues.appointments.next(
          this.normalizeAppointmentData(value?.result)
        );
      } else {
        throw "Appointment: RESPONSE FORMAT IS INVALID";
      }
    }
    if (event === LoadTimeSlots) {
      this.currentValues.loadingTimeSlots.next(false);
      if (Array.isArray(value.result)) {
        this.currentValues.timeSlots.next(value.result);
      } else {
        this.currentValues.timeSlots.next(null);
        throw "Timeslot: RESPONSE FORMAT IS INVALID";
      }
    }
  };

  resetValue() {
    Object.keys(this.currentValues).forEach((key) => {
      if (!this.currentValues[key].closed) {
        this.currentValues[key].unsubscribe();
        this.currentValues[key] = new BehaviorSubject(null);
      }
    });
  }
}
