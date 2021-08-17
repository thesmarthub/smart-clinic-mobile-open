import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarketPlacePage } from './market-place.page';

const routes: Routes = [
  {
    path: '',
    component: MarketPlacePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarketPlacePageRoutingModule {}
