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
  AlertController,
  PickerController,
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
import { BehaviorSubject, Subscription } from "rxjs";

@Component({
  selector: "app-view-appointments",
  templateUrl: "./view-appointments.page.html",
  styleUrls: ["./view-appointments.page.scss"],
})
export class ViewAppointmentsPage implements OnInit {
  daysConfig: DayConfig[] = [];
  store = new Store();
  loading: HTMLIonLoadingElement;
  fresh = true;
  tempSubs: Subscription[] = [];
  availableSlots = new BehaviorSubject([]);
  enabledSlots = [];
  selectedDepartment;
  rangeGenerator = rangeGenerator;
  constructor(
    public aService: AppointmentService,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private pickerController: PickerController
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.aService.triggerEvent(LoadAppointments);
    const sub1 = this.aService.currentValues.timeSlots.subscribe(
      (data: any[]) => {
        if (Array.isArray(data) && data.length > 0 && !this.fresh) {
          const expanded = [];
          data.forEach((el) => {
            el?.slots?.forEach((e) => {
              if (e) {
                expanded.push(e);
              }
            });
          });
          let { daysConfig, numberOfDays } = this.configureDates(expanded);
          console.log("num days", numberOfDays);
          console.log("enabled slots", this.enabledSlots);
          if (numberOfDays > 0) {
            this.daysConfig = daysConfig;
            this.openCalendar();
          } else {
            this.loading.dismiss();
            this.noTimeSlotsAlert();
          }
        } else if (Array.isArray(data)) {
          this.loading.dismiss();
          this.noTimeSlotsAlert();
        }
      }
    );
    this.fresh = false;
    this.tempSubs.push(sub1);
  }

  ionViewDidLeave() {
    this.aService.resetValue();
    this.tempSubs.forEach((sub) => {
      if (!sub.closed) {
        sub.unsubscribe();
      }
    });
    this.selectedDepartment = null;
  }

  noTimeSlotsAlert() {
    this.presentAlert({
      header: "Time Slots",
      message: "No time slot available here.",
    });
  }

  async openCalendar() {
    const options: CalendarModalOptions = {
      // daysConfig: this.daysConfig,
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
    this.setAvailableSlots(date.string);
    this.presentPicker(this.availableSlots.value);
    // const from: CalendarResult = date.from;
    // const to: CalendarResult = date.to;
  }

  loadTimeSlots() {
    this.presentLoading({});
    this.aService.triggerEvent(LoadTimeSlots, {
      "slot.start_time": moment().startOf("year"),
      "slot.end_time": moment().endOf("year"),
      "slots.department_route":
        this.selectedDepartment?.route ?? "general-health",
    });
    // this.presentAlert();
  }

  configureDates(slots: any[]) {
    let numberOfDays = 0;
    const daysConfig: DayConfig[] = this.rangeGenerator(1, 360).map((num) => {
      return this.disableDate(moment().dayOfYear(num).toDate());
    });
    this.enabledSlots = [];
    for (const config of daysConfig) {
      if (
        slots.find((slot: any) => {
          const isValidSlot =
            moment(slot.start_time).dayOfYear() ===
            moment(config.date).dayOfYear();
          if (isValidSlot) {
            this.enabledSlots.push(slot);
          }
          return isValidSlot;
        })
      ) {
        if (moment(config.date).startOf("day") < moment().startOf("day")) {
          config.disable = false;
          numberOfDays += 1;
          console.log("Found matching days", config.date.getDate());
        }
      }
    }
    return { daysConfig, numberOfDays };
  }

  setAvailableSlots(date) {
    console.log(this.enabledSlots);
    const availableSlots = this.enabledSlots.filter((slot) => {
      return moment(slot.start_time).dayOfYear() === moment(date).dayOfYear();
    });
    console.log(this.availableSlots);
    this.availableSlots.next(availableSlots);
  }

  disableDate(date: Date): DayConfig {
    return {
      date,
      disable: true,
    };
  }

  async presentLoading({
    message = "Please wait...",
    duration = 2000,
    spinner = "bubbles",
  }: {
    message?: string;
    duration?: number;
    spinner?:
      | "bubbles"
      | "circles"
      | "circular"
      | "crescent"
      | "dots"
      | "lines"
      | "lines-small";
  }) {
    this.loading = await this.loadingController.create({
      message,
      duration,
      spinner,
    });
    await this.loading.present();
  }

  async presentAlert({ header = "Alert", subHeader = "", message = "" }) {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      buttons: ["OK"],
    });

    await alert.present();
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
            this.selectedDepartment = JSON.parse(JSON.stringify(data));
            this.loadTimeSlots();
          },
        };
      }),
      mode: "ios",
    });

    await actionSheet.present();
  }

  async presentPicker(slots: any[]) {
    const picker = await this.pickerController.create({
      animated: true,
      buttons: [
        {
          text: "Book Now",
          handler: (val) => {
            const data = {
              appointment_type: "Future",
              appointment_time: val.Time?.text,
              clinic: this.selectedDepartment.name,
              department_route: this.selectedDepartment.route,
              hospital_number: this.store?.user.hospital_number,
              patient: this.store?.user._id,
              hmo_or_retainer: null,
              has_approved_hmo: false,
              patient_sex: this.store?.user.sex,
              patient_dob: this.store?.user.d_o_b,
              smart_code: this.selectedDepartment.route,
              slot_id: val.slot?._id,
            };
            console.log(val);
            this.aService.createAppointment(data);
          },
        },
        {
          text: "Back to Calendar",
          handler: (val) => {
            console.log("Going back to calendar");
            this.loadTimeSlots();
          },
        },
      ],
      columns: [
        {
          name: "slot",
          // prefix: 'total',
          // suffix: 'hours',
          options: [
            ...slots.map((data) => {
              return {
                text: moment(data.start_time).format("MM/DD/YYYY HH:MM A"),
                value: data._id,
              };
            }),
          ],
        },
      ],
      cssClass: "picker-hours",
      mode: "ios",
    });
    picker.present();
  }
}
