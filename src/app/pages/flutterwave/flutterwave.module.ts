import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FlutterwavePageRoutingModule } from './flutterwave-routing.module';

import { FlutterwavePage } from './flutterwave.page';
import { FlutterwaveModule } from 'flutterwave-angular-v3';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlutterwavePageRoutingModule,
    FlutterwaveModule
  ],
  declarations: [FlutterwavePage],
  exports: [FlutterwavePage]
})
export class FlutterwavePageModule {}
