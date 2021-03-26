import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GeneralService } from "./general.service";

@Injectable({
  providedIn: "root",
})
export class DoctorService {
  constructor(private _genService: GeneralService) {}

  fetchDoctors(departmentRoute): Observable<any> {
    return this._genService.http.post(
      `${this._genService.baseUrl}hospital/patient-request`,
      {},
      {
        params: {
          action: "VIEW_AVAILABLE_SPECIALISTS",
          department_route: departmentRoute,
          is_available_for_mobile: "yes"
        },
      }
    );
  }
}
