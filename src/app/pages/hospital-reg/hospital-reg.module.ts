import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HospitalRegPageRoutingModule } from './hospital-reg-routing.module';

import { HospitalRegPage } from './hospital-reg.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HospitalRegPageRoutingModule,
    ReactiveFormsModule,
    
  ],
  declarations: [HospitalRegPage]
})
export class HospitalRegPageModule {}
