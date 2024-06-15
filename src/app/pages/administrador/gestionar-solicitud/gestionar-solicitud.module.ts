import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionarSolicitudPageRoutingModule } from './gestionar-solicitud-routing.module';

import { GestionarSolicitudPage } from './gestionar-solicitud.page';
import { ModuloNavbarModule } from 'src/app/modulos/modulo-navbar/modulo-navbar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionarSolicitudPageRoutingModule,
    ModuloNavbarModule
  ],
  declarations: [GestionarSolicitudPage]
})
export class GestionarSolicitudPageModule {}
