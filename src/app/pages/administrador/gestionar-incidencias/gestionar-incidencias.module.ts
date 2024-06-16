import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionarIncidenciasPageRoutingModule } from './gestionar-incidencias-routing.module';

import { GestionarIncidenciasPage } from './gestionar-incidencias.page';
import { ModuloNavbarModule } from 'src/app/modulos/modulo-navbar/modulo-navbar.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionarIncidenciasPageRoutingModule,
    ModuloNavbarModule
  ],
  declarations: [GestionarIncidenciasPage]
})
export class GestionarIncidenciasPageModule {}
