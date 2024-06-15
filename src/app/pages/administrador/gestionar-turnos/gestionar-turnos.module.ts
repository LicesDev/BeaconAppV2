import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionarTurnosPageRoutingModule } from './gestionar-turnos-routing.module';

import { GestionarTurnosPage } from './gestionar-turnos.page';
import { ModuloNavbarModule } from 'src/app/modulos/modulo-navbar/modulo-navbar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionarTurnosPageRoutingModule,
    ModuloNavbarModule
  ],
  declarations: [GestionarTurnosPage]
})
export class GestionarTurnosPageModule {}
