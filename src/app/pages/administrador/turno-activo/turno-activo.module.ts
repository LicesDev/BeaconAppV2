import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TurnoActivoPageRoutingModule } from './turno-activo-routing.module';

import { TurnoActivoPage } from './turno-activo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TurnoActivoPageRoutingModule
  ],
  declarations: [TurnoActivoPage]
})
export class TurnoActivoPageModule {}
