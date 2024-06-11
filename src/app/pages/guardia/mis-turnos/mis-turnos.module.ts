import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisTurnosPageRoutingModule } from './mis-turnos-routing.module';

import { MisTurnosPage } from './mis-turnos.page';
import { ModuloNavbarModule } from 'src/app/modulos/modulo-navbar/modulo-navbar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisTurnosPageRoutingModule,
    ModuloNavbarModule
  ],
  declarations: [MisTurnosPage]
})
export class MisTurnosPageModule {}
