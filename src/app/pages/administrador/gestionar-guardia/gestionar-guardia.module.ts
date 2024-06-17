import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionarGuardiaPageRoutingModule } from './gestionar-guardia-routing.module';

import { GestionarGuardiaPage } from './gestionar-guardia.page';
import { ModuloNavbarModule } from 'src/app/modulos/modulo-navbar/modulo-navbar.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionarGuardiaPageRoutingModule,
    ModuloNavbarModule,
    
  ],
  declarations: [GestionarGuardiaPage]
})
export class GestionarGuardiaPageModule {}
