import { Injectable } from "@angular/core";
import { ActionSheetController } from "@ionic/angular";
import { Store } from "../engine/store";

@Injectable({
  providedIn: "root",
})
export class DepartmentService {
  store = new Store();
  constructor(private actionSheetController: ActionSheetController) {}

  async presentActionSheet(callback = (data) => {}) {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Department",
      buttons: this.store.currentHospital.departments.map((data) => {
        return {
          text: data.name,
          role: "option",
          icon: "option",
          handler: () => {
            callback(data);
          },
          // handler: () => {
          //   JSON.parse(JSON.stringify(data));
          //   this.selectedDepartment = JSON.parse(JSON.stringify(data));
          //   this.loadTimeSlots();
          // },
        };
      }),
      mode: "ios",
    });

    await actionSheet.present();
  }
  getGOPDDept() {
    return this.store.currentHospital.departments.find(
      (dept) => dept.route === "general-health"
    );
  }
}
