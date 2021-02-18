import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PleaseWaitPage } from './please-wait.page';

const routes: Routes = [
  {
    path: '',
    component: PleaseWaitPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PleaseWaitPageRoutingModule {}
