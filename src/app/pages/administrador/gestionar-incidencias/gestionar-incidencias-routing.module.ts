import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionarIncidenciasPage } from './gestionar-incidencias.page';

const routes: Routes = [
  {
    path: '',
    component: GestionarIncidenciasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionarIncidenciasPageRoutingModule {}
