import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashadminPageRoutingModule } from './dashadmin-routing.module';

import { DashadminPage } from './dashadmin.page';

import { ModuloNavbarModule } from 'src/app/modulos/modulo-navbar/modulo-navbar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashadminPageRoutingModule,
    ModuloNavbarModule
  ],
  declarations: [DashadminPage]
})
export class DashadminPageModule {}
