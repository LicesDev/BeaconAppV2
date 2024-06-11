import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TomarTurnosPage } from './tomar-turnos.page';

const routes: Routes = [
  {
    path: '',
    component: TomarTurnosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TomarTurnosPageRoutingModule {}
