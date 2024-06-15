import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../app/servicio/auth.service';


@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrls: ['./navbar-admin.component.scss'],
})
export class NavbarAdminComponent  implements OnInit {

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    let element = document.getElementById('navbarToggleExternalContent');
    if (element) {
      let bsCollapse = new bootstrap.Collapse(element, {
        toggle: false,
      });
    }
  }

  logOut() {
    this.authService.logout(); // Llama al método logout de AuthServiceService aquí
    this.router.navigate(['/login']);
  }
}
