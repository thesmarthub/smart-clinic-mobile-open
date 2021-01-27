import { Component, OnInit } from "@angular/core";
import {
  LoadAppointments,
  LoadTimeSlots,
} from "src/app/actions/events/appointment";
import { AppointmentService } from "src/app/services/appointment.service";
import {
  ModalController,
  LoadingController,
  ActionSheetController,
} from "@ionic/angular";

import {
  CalendarModal,
  CalendarModalOptions,
  DayConfig,
  CalendarResult,
} from "ion2-calendar";

import { CalendarPage } from "../calendar/calendar.page";
import * as moment from "moment";
import { Store } from "../../engine/store";
import { rangeGenerator } from "src/app/engine/utility";

@Component({
  selector: "app-view-appointments",
  templateUrl: "./view-appointments.page.html",
  styleUrls: ["./view-appointments.page.scss"],
})
export class ViewAppointmentsPage implements OnInit {
  daysConfig: DayConfig[] = [];
  store = new Store();
  rangeGenerator = rangeGenerator;
  constructor(
    public aService: AppointmentService,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private actionSheetController: ActionSheetController
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.aService.triggerEvent(LoadAppointments);
    this.aService.currentValues.timeSlots.subscribe((data: any[]) => {
      if (Array.isArray(data) && data.length > 0) {
        const expanded = [];
        data.forEach((el) => {
          el?.slots?.forEach((e) => {
            if (e) {
              expanded.push(e);
            }
          });
        });
        this.daysConfig = this.configureDates(expanded);
        this.openCalendar();
      }
    });
  }

  async openCalendar() {
    const options: CalendarModalOptions = {
      daysConfig: this.daysConfig,
      pickMode: "single",
    };
    const modal = await this.modalController.create({
      component: CalendarModal,
      componentProps: {
        options,
      },
    });
    modal.present();

    const event: any = await modal.onDidDismiss();
    const date = event.data;
    // const from: CalendarResult = date.from;
    // const to: CalendarResult = date.to;

    console.log(date);
  }

  loadTimeSlots({ departmentRoute }: { departmentRoute: string }) {
    this.presentLoading();
    this.aService.triggerEvent(LoadTimeSlots, {
      "slot.start_time": moment().startOf("year"),
      "slot.end_time": moment().endOf("year"),
      "slots.department_route": departmentRoute ?? "general-health",
    });
    // this.presentAlert();
  }

  configureDates(slots: any[]) {
    const daysConfig: DayConfig[] = this.rangeGenerator(1, 360).map((num) => {
      return this.disableDate(moment().dayOfYear(num).toDate());
    });
    for (const config of daysConfig) {
      if (
        slots.find(
          (slot: any) =>
            moment(slot.start_time).dayOfYear() ===
            moment(config.date).dayOfYear()
        )
      ) {
        console.log("Found matching days", config.date);
        config.disable = false;
      }
    }
    return daysConfig;
  }

  disableDate(date: Date): DayConfig {
    return {
      date,
      disable: true,
    };
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: "Loading Time Slots",
      duration: 2000,
      spinner: "bubbles",
    });
    await loading.present();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Departments",
      buttons: this.store.currentHospital.departments.map((data) => {
        return {
          text: data.name,
          role: "option",
          icon: "option",
          handler: () => {
            this.loadTimeSlots({ departmentRoute: data.route });
          },
        };
      }),
      // buttons: this.store.currentHospital. [{
      //   text: 'Delete',
      //   role: 'destructive',
      //   icon: 'trash',
      //   handler: () => {
      //     console.log('Delete clicked');
      //   }
      // }, {
      //   text: 'Share',
      //   icon: 'share',
      //   handler: () => {
      //     console.log('Share clicked');
      //   }
      // }, {
      //   text: 'Cancel',
      //   icon: 'close',
      //   role: 'cancel',
      //   handler: () => {
      //     console.log('Cancel clicked');
      //   }
      // }],
      mode: "ios",
    });

    await actionSheet.present();
  }
}
