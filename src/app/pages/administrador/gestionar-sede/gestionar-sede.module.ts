import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionarSedePageRoutingModule } from './gestionar-sede-routing.module';

import { GestionarSedePage } from './gestionar-sede.page';
import { ModuloNavbarModule } from 'src/app/modulos/modulo-navbar/modulo-navbar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionarSedePageRoutingModule,
    ModuloNavbarModule
  ],
  declarations: [GestionarSedePage]
})
export class GestionarSedePageModule {}
