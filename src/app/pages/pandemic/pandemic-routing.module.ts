import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PandemicPage } from './pandemic.page';

const routes: Routes = [
  {
    path: '',
    component: PandemicPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PandemicPageRoutingModule {}
