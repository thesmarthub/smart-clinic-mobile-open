import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HealthShopPageRoutingModule } from './health-shop-routing.module';

import { HealthShopPage } from './health-shop.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HealthShopPageRoutingModule
  ],
  declarations: [HealthShopPage]
})
export class HealthShopPageModule {}
