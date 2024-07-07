import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../servicio/auth.service';
import { Http } from '@capacitor-community/http';

import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';
import { LocalNotifications } from '@capacitor/local-notifications';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  usuario: string = '';
  pass: string = '';
  showPassword = false;

  contadorFallido=4;

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.solicitarPermisos();
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  async solicitarPermisos() {
    // Solicitar permiso para acceder a la ubicación
    const permisoUbicacion = await Geolocation.requestPermissions();

    if (permisoUbicacion.location === 'granted') {
      // Solicitar permiso para enviar notificaciones solo si el permiso de ubicación fue concedido
      await LocalNotifications.requestPermissions();
    }
  }

  async login() {
    // Verificar si los campos están vacíos
    if (!this.usuario || !this.pass) {
      this.toast('Campos vacíos');
      return;
    }

    // Hashear la contraseña ingresada por el usuario
    const inputHashedPassword = CryptoJS.SHA256(this.pass).toString();

    console.log(`Usuario: ${this.usuario}`);
    console.log(`Contraseña hasheada: ${inputHashedPassword}`);
  
    // Autenticación con el servidor
    this.http
      .post('https://osolices.pythonanywhere.com/login/', {
        nombre_usuario: this.usuario,
        contrasena: inputHashedPassword, // Enviar la contraseña hasheada
      })
      .pipe(
        catchError((error) => {
          if (error.status === 404) {
            // Muestra la alerta de usuario incorrecto
            this.toast('Usuario o contraseña incorrecto');
            this.contadorFallido--
            setTimeout(() => {
              this.toast('Intentos restantes: ' + this.contadorFallido);
            }, 1500);

            if (this.contadorFallido===0) {
              this.toast('Usuario bloqueado');
              
            }
          }
          return throwError(error);
        })
      )
      .subscribe(async (resp: any) => {
        if (resp) {
          // Almacenar los datos del usuario en el almacenamiento local
          this.authService.login(resp.data); // Utiliza el método de inicio de sesión del servicio
          console.log(resp);
  
          // Redirigir al usuario a la página correspondiente
          if (resp.perfil === 'guardia') {
            console.log('Redirigiendo a /dashboard-guardia');
            this.router.navigate(['/dashguard']);
          } else if (resp.perfil === 'administrador') {
            console.log('Redirigiendo a /dashboard-administrador');
            this.router.navigate(['/dashadmin']);
          }
        } else {
          this.toast('Usuario o contraseña incorrecto');
        }
      });
  }
  


  toast(mensaje: string) {
    const toast = document.createElement('ion-toast');
    toast.message = mensaje;
    toast.duration = 2000;
    toast.cssClass = 'my-toast'; // Añade esta línea

    document.body.appendChild(toast);
    return toast.present();
  }
}
