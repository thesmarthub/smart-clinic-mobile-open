import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlutterwavePage } from './flutterwave.page';

const routes: Routes = [
  {
    path: '',
    component: FlutterwavePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlutterwavePageRoutingModule {}
