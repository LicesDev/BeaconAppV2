import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../servicio/auth.service';
import { Http } from '@capacitor-community/http';

import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Geolocation, PermissionStatus } from '@capacitor/geolocation';
import { LocalNotifications } from '@capacitor/local-notifications';
import { BluetoothLe, RequestBleDeviceOptions } from '@capacitor-community/bluetooth-le';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  usuario: string = '';
  pass: string = '';
  administrador: string = '';
  guardia: string = '';
  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.solicitarPermisos();
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
      this.mostrarAlerta('Campos vacíos');
      return;
    }
  
    console.log(`Usuario: ${this.usuario}`);
    console.log(`Contraseña: ${this.pass}`);
  
    // Autenticación con el servidor
    this.http
      .post('https://osolices.pythonanywhere.com/login/', {
        nombre_usuario: this.usuario,
        contrasena: this.pass,
      })
      .pipe(
        catchError(error => {
          if (error.status === 404) {
            // Muestra la alerta de usuario incorrecto
            this.mostrarAlerta('Usuario o contraseña incorrecto');
          }
          return throwError(error);
        })
      )
      .subscribe(async (resp: any) => {
        if (resp) {
          // Almacenar los datos del usuario en el almacenamiento local
          this.authService.login(resp); // Utiliza el método de inicio de sesión del servicio
  
          // Redirigir al usuario a la página correspondiente
          if (this.usuario.includes(this.guardia)) {
            console.log('Redirigiendo a /dashboard-guardia');
            this.router.navigate(['/dashguard']);
          } else if (this.usuario.includes(this.administrador)) {
            console.log('Redirigiendo a /dashboard-administrador');
            this.router.navigate(['/dashboard-administrador']);
          }
        } else {
          this.mostrarAlerta('Usuario o contraseña incorrecto');
        }
      });
  }

  

  

  async mostrarAlerta(mensaje: string) {
    console.log('Mostrando alerta');
    let alerta = this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      position: 'bottom',
    });
    (await alerta).present();
  }
}  