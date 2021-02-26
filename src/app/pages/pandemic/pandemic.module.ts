import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PandemicPageRoutingModule } from './pandemic-routing.module';

import { PandemicPage } from './pandemic.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PandemicPageRoutingModule
  ],
  declarations: [PandemicPage]
})
export class PandemicPageModule {}
