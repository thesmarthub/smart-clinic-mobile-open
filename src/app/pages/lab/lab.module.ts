import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LabPageRoutingModule } from './lab-routing.module';

import { LabPage } from './lab.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LabPageRoutingModule
  ],
  declarations: [LabPage]
})
export class LabPageModule {}
