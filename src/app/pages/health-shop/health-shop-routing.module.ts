import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HealthShopPage } from './health-shop.page';

const routes: Routes = [
  {
    path: '',
    component: HealthShopPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HealthShopPageRoutingModule {}
