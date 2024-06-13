import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RemuneracionesPage } from './remuneraciones.page';

const routes: Routes = [
  {
    path: '',
    component: RemuneracionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RemuneracionesPageRoutingModule {}
