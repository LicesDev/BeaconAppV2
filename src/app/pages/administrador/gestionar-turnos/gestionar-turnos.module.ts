import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionarTurnosPageRoutingModule } from './gestionar-turnos-routing.module';

import { GestionarTurnosPage } from './gestionar-turnos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionarTurnosPageRoutingModule
  ],
  declarations: [GestionarTurnosPage]
})
export class GestionarTurnosPageModule {}
