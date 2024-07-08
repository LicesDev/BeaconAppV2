import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../app/servicio/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent  implements OnInit {

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    
  }

  logOut() {
    this.authService.logout(); 
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });

  }
}
