import { Component, OnInit } from "@angular/core";
import {
  AlertController,
  ModalController,
  NavController,
} from "@ionic/angular";
import { CalendarComponentOptions, DayConfig } from "ion2-calendar";
import * as moment from "moment";
import { LoadTimeSlots } from "src/app/actions/events/appointment";
import { AppointmentService } from "src/app/services/appointment.service";
@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.page.html",
  styleUrls: ["./calendar.page.scss"],
})
export class CalendarPage implements OnInit {
  selectedDate;
  selectedOptions: CalendarComponentOptions = {
    // daysConfig: [{date: moment().toDate(), disable: true}],
  };
  selectedType;
  selectedFormat;
  constructor(
    public aService: AppointmentService,
    private modalCtrl: ModalController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
  }
  
  ionViewDidEnter() {
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  onChange(event) {
    // TODO: display slots
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: "Alert",
      subHeader: "Subtitle",
      message: "This is an alert message.",
      buttons: ["OK"],
    });

    await alert.present();
  }
}
