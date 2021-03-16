import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HospitalRegPage } from './hospital-reg.page';

const routes: Routes = [
  {
    path: '',
    component: HospitalRegPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HospitalRegPageRoutingModule {}
