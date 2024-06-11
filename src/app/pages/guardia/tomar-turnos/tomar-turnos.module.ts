import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TomarTurnosPageRoutingModule } from './tomar-turnos-routing.module';

import { TomarTurnosPage } from './tomar-turnos.page';
import { ModuloNavbarModule } from 'src/app/modulos/modulo-navbar/modulo-navbar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TomarTurnosPageRoutingModule,
    ModuloNavbarModule
  ],
  declarations: [TomarTurnosPage]
})
export class TomarTurnosPageModule {}
