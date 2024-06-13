import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RemuneracionesPageRoutingModule } from './remuneraciones-routing.module';

import { RemuneracionesPage } from './remuneraciones.page';

import { ModuloNavbarModule } from 'src/app/modulos/modulo-navbar/modulo-navbar.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RemuneracionesPageRoutingModule,
    ModuloNavbarModule
  ],
  declarations: [RemuneracionesPage]
})
export class RemuneracionesPageModule {}
