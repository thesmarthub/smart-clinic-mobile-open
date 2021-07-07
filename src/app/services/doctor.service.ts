import { Injectable } from "@angular/core";
import { ActionSheetController } from "@ionic/angular";
import { Observable } from "rxjs";
import { Store } from "../engine/store";
import { GeneralService } from "./general.service";

@Injectable({
  providedIn: "root",
})
export class DoctorService {
  store: Store = new Store();
  constructor(
    private _genService: GeneralService,
    private actionSheetController: ActionSheetController
  ) {}

  fetchDoctors(departmentRoute): Observable<any> {
    return this._genService.http.get(
      `${this._genService.baseUrl}auth/get-staff`,
      {
        params: {
          action: "VIEW_AVAILABLE_SPECIALISTS",
          department_route: departmentRoute,
          is_available_for_mobile: "yes",
        },
      }
    );
  }

  async presentActionSheet(
    callback = (data: "current_hospital_doctors" | "all_doctors") => {}
  ) {
    const actionSheet = await this.actionSheetController.create({
      header: "Where should we fetch doctors?",
      buttons: [
        {
          text: `${this.store.currentHospital.name}`,
          role: "option",
          icon: "option",
          handler: () => {
            callback("current_hospital_doctors");
          },
        },
        {
          text: `Everywhere`,
          role: "option",
          icon: "option",
          handler: () => {
            callback("all_doctors");
          },
        },
      ],
      mode: "ios",
    });

    await actionSheet.present();
  }

  transformDoctorData(data) {
    if (data.smartCode) {
      data.smart_code = data.smartCode;
    }
    if (data.name) {
      data.fname = data.name;
    }
  }

  transformServiceData(data) {}
}
