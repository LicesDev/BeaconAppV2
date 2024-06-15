import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from 'src/app/componentes/navbar/navbar.component';
import { NavbarAdminComponent } from 'src/app/componentes/navbar-admin/navbar-admin.component';

@NgModule({
  declarations: [NavbarComponent, NavbarAdminComponent],
  imports: [
    CommonModule
  ],
  exports: [NavbarComponent, NavbarAdminComponent]
})
export class ModuloNavbarModule { }
