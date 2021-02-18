import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PleaseWaitPageRoutingModule } from './please-wait-routing.module';

import { PleaseWaitPage } from './please-wait.page';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PleaseWaitPageRoutingModule,
    HttpClientModule
  ],
  declarations: [PleaseWaitPage]
})
export class PleaseWaitPageModule {}
