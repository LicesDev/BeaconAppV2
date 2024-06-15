import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionarGuardiaPage } from './gestionar-guardia.page';

const routes: Routes = [
  {
    path: '',
    component: GestionarGuardiaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionarGuardiaPageRoutingModule {}
