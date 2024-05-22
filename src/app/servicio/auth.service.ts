import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  // Método para iniciar sesión
  login(userData: any) {
    window.localStorage.setItem('userData', JSON.stringify(userData));
  }

  // Método para cerrar sesión
  logout() {
    window.localStorage.removeItem('userData');
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return window.localStorage.getItem('userData') !== null;
  }
}
