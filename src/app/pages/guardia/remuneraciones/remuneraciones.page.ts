import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../servicio/auth.service';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-remuneraciones',
  templateUrl: './remuneraciones.page.html',
  styleUrls: ['./remuneraciones.page.scss'],
})
export class RemuneracionesPage implements OnInit {
  asignaciones: any[] = [];
  totalRemuneracion = 0;
  currentValue = new Date().toISOString();
  showModal = false;

  @ViewChild('modal') modal: any;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.getTurnosGuardia();
  }

  getTurnosGuardia() {
    const userData = window.localStorage.getItem('userData');
    console.log(userData);
    if (userData) {
      const rut = JSON.parse(userData).rut_guarida;
      console.log(rut);
      this.http
        .get(`https://osolices.pythonanywhere.com/asignacionturno/`)
        .subscribe((dataAs: any) => {
          const asignacionesGuardia = dataAs.filter(
            (dataAs: any) => dataAs.rut_guarida === rut
          );
          const asignacionesFinalizadas = asignacionesGuardia.filter(
            (asig: any) => asig.estado === true
          );
          console.log('A:', asignacionesGuardia);
          console.log('B:', asignacionesFinalizadas);
  
          this.http
          .get(`https://osolices.pythonanywhere.com/turno/`)
          .subscribe((dataS: any) => {
            let fecha = this.currentValue.toString().split('T')[0];
            const fechaSplit = fecha.split('-');
            const yearCurrent = fechaSplit[0];
            const monthCurrent = fechaSplit[1];
            console.log(yearCurrent + '-' + monthCurrent);
            console.log(dataS);
            const filteredDataS = dataS.filter((dato:any) => {
              const fecha = dato.fecha;
              const fechaSplit = fecha.split('-');
              const year = fechaSplit[0];
              const month = fechaSplit[1];
              return year === yearCurrent && month === monthCurrent;
            });
            console.log('Datos filtrados:', filteredDataS);
  
            const idTurnosFinalizados = asignacionesFinalizadas.map((asig: any) => asig.id_turno);
            const filteredTurnos = filteredDataS.filter((dato:any) => idTurnosFinalizados.includes(dato.id_turno));
            console.log('Turnos filtrados:', filteredTurnos);
  
            const turnosWithAsignacionId = filteredTurnos.map((turno:any) => {
              const asignacion = asignacionesFinalizadas.find((asig:any) => asig.id_turno === turno.id_turno);
              return {...turno, id_asignacion: asignacion.id_asignacion};
            });
            console.log('Turnos con id_asignacion:', turnosWithAsignacionId);
            this.http
            .get(`https://osolices.pythonanywhere.com/asistencia/`)
            .subscribe((allAsistencias: any) => {
              console.log(allAsistencias);
              turnosWithAsignacionId.forEach((turno: any) => {
                const asistencia = allAsistencias.find(
                  (a: any) => a.id_asignacion === turno.id_asignacion
                );
                if (asistencia) {
                  const asistenciaWithFecha = {...asistencia, fecha: turno.fecha};
                  console.log('Asistencia con fecha:', asistenciaWithFecha);
                  this.asignaciones.push(asistenciaWithFecha);
                }
              });
              console.log(this.asignaciones);
              this.totalRemuneracion = this.asignaciones.reduce((total, asignacion) => total + asignacion.remuneracion_final, 0);
            });
          });
        });
    }
  }
  
  openModal() {
    this.showModal = true;
  }

  onIonChange(event: CustomEvent) {
    this.currentValue = event.detail.value;
    this.asignaciones= [];
    this.totalRemuneracion = 0;
    this.getTurnosGuardia();
  }

  onDidDismiss(event: CustomEvent) {
    console.log('Fecha seleccionada:', this.currentValue);
    this.showModal = false;
  }
}
