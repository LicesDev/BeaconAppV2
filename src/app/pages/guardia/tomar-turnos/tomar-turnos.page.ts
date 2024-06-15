import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../servicio/auth.service';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-tomar-turnos',
  templateUrl: './tomar-turnos.page.html',
  styleUrls: ['./tomar-turnos.page.scss'],
})
export class TomarTurnosPage implements OnInit {
  asignaciones: any[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.getTurnosGuardia();
  }

  async getTurnosGuardia() {
    const userData = window.localStorage.getItem('userData');
    if (userData) {
      const rut = JSON.parse(userData).rut_guarida;
      try {
        const dataAs: any = await this.http.get('https://osolices.pythonanywhere.com/asignacionturno/').toPromise();
        const asignacionesGuardia = dataAs.filter((dataAs: any) => dataAs.rut_guarida === rut);
        console.log(asignacionesGuardia);

        const dataS: any = await this.http.get('https://osolices.pythonanywhere.com/turno/').toPromise();
        const fechaActual = new Date().toISOString().split('T')[0];
        let turnos = dataS.filter((dataS: any) => new Date(dataS.fecha) >= new Date(fechaActual));
        console.log(turnos);

        asignacionesGuardia.forEach((dato: any) => {
          console.log(dato);
          turnos = turnos.filter((turno: any) => dato.id_turno !== turno.id_turno);
          console.log(turnos);
        });
        console.log(turnos);

        this.asignaciones = [];
        for (const turno of turnos) {
          console.log(turno);

            const sedeData: any = await this.http.get('https://osolices.pythonanywhere.com/sede/').toPromise();
            const sede = sedeData.filter((sedeData: any) => sedeData.id_sede === turno.id_sede);

            if (sede.length > 0) {
              const nombre = sede[0].nombre;
              const direccion = sede[0].direccion;
              const foto = sede[0].foto;
              turno.nombre = nombre;
              turno.direccion = direccion;
              turno.foto = foto;
              this.asignaciones.push(turno);
            }
          
        }
        console.log(this.asignaciones);
        this.cd.detectChanges();
      } catch (error) {
        console.error('Error fetching data', error);
      }
    }
  }

  navegar(asignacion: any) {
    let queryParams = {
      id_asignacion: asignacion.id_asignacion,
      rut_guarida: asignacion.rut_guarida,
      id_turno: asignacion.id_turno,
      fecha: asignacion.fecha,
      hora_inicio: asignacion.hora_inicio,
      hora_fin: asignacion.hora_fin,
      remuneracion: asignacion.remuneracion,
      nombre: asignacion.nombre,
      direccion: asignacion.direccion,
      foto: asignacion.foto,
    };

    this.router.navigate(['/asistencia'], { queryParams });
  }

  async confirmarTomarTurno(id_turno: number) {
    const result = await Swal.fire({
      title: 'Confirmación',
      text: '¿Estás seguro de que tomar el turno?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, tomar',
      cancelButtonText: 'No, cancelar',
      heightAuto: false,
      confirmButtonColor: 'rgb(57, 88, 134)',
    });

    if (result.isConfirmed) {
      this.tomarTurno(id_turno);
    }
  }

  async tomarTurno(id_turno: number) {
    const userData = window.localStorage.getItem('userData');
    if (userData) {
      const rut = JSON.parse(userData).rut_guarida;
  
      const body = {
        rut_guarida: rut,
        id_turno: id_turno,
      };
      this.http
        .post('https://osolices.pythonanywhere.com/asignacionturno/', body)
        .subscribe(
          (response: any) => {
            this.toast('Turno Tomado');
            this.getTurnosGuardia();
            this.cd.detectChanges();
          },
          (error: any) => {
            this.toast('Error al tomar el turno');
          }
        );
    }
  }

  toast(mensaje: string) {
    const toast = document.createElement('ion-toast');
    toast.message = mensaje;
    toast.duration = 2000;
    toast.cssClass = 'my-toast'; 

    document.body.appendChild(toast);
    return toast.present();
  }
}
