import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionarSedePage } from './gestionar-sede.page';

const routes: Routes = [
  {
    path: '',
    component: GestionarSedePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionarSedePageRoutingModule {}
