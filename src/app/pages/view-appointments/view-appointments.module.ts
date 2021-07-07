import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewAppointmentsPageRoutingModule } from './view-appointments-routing.module';

import { ViewAppointmentsPage } from './view-appointments.page';
import { CalendarModule } from 'ion2-calendar';
import { DatePicker } from '@ionic-native/date-picker/ngx';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewAppointmentsPageRoutingModule,
    CalendarModule
  ],
  declarations: [ViewAppointmentsPage],
  providers: [DatePicker]
})
export class ViewAppointmentsPageModule {}
