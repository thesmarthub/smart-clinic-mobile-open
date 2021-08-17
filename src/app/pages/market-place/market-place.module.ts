import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MarketPlacePageRoutingModule } from './market-place-routing.module';

import { MarketPlacePage } from './market-place.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MarketPlacePageRoutingModule
  ],
  declarations: [MarketPlacePage]
})
export class MarketPlacePageModule {}
