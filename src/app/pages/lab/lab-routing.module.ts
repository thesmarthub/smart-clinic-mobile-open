import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LabPage } from './lab.page';

const routes: Routes = [
  {
    path: '',
    component: LabPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LabPageRoutingModule {}
