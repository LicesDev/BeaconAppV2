import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionarTurnosPage } from './gestionar-turnos.page';

const routes: Routes = [
  {
    path: '',
    component: GestionarTurnosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionarTurnosPageRoutingModule {}
