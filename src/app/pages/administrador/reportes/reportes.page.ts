import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../servicio/auth.service';
import { ModalController } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
})
export class ReportesPage implements OnInit {
  asistencias: any[] = [];
  currentValue = new Date().toISOString();
  currentValueSede = 0;
  currentNombreSede = 'Todas';
  showModal = false;
  showModalSede = false;
  @ViewChild('modal') modal: any;
  @ViewChild('modalSede') modalSede: any;
  sedes: any[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.getAsistencias();
  }

  getAsistencias() {
    this.http
      .get(`https://osolices.pythonanywhere.com/asistencia/`)
      .subscribe((asistencias: any) => {
        asistencias.forEach((asis: any) => {
          this.http
            .get(
              `https://osolices.pythonanywhere.com/asignacionturno/${asis.id_asignacion}/`
            )
            .subscribe((asignacion: any) => {
              console.log(asignacion);
              this.http
                .get(
                  `https://osolices.pythonanywhere.com/turno/${asignacion.id_turno}/`
                )
                .subscribe((turno: any) => {
                  console.log(turno);
                  const fecha_seleccionada = this.currentValue
                    .toString()
                    .split('T')[0];
                  const fechaSeleSplit = fecha_seleccionada.split('-');
                  const yearCurrent = fechaSeleSplit[0];
                  const monthCurrent = fechaSeleSplit[1];
                  const fecha = turno.fecha;
                  const fechaSplit = fecha.split('-');
                  const year = fechaSplit[0];
                  const month = fechaSplit[1];
                  console.log(year + '-' + month);
                  console.log(yearCurrent + '-' + monthCurrent);
                  if (year + '-' + month === yearCurrent + '-' + monthCurrent) {
                    this.http
                      .get(
                        `https://osolices.pythonanywhere.com/sede/${turno.id_sede}/`
                      )
                      .subscribe((sede: any) => {
                        console.log(sede);
                        this.http
                          .get(
                            `https://osolices.pythonanywhere.com/guardia/${asignacion.rut_guarida}/`
                          )
                          .subscribe((guardia: any) => {
                            console.log(guardia);

                            asis.id_turno = asignacion.id_turno;
                            asis.guardia =
                              guardia.p_nombre + ' ' + guardia.p_apellido;
                            asis.fecha = turno.fecha;
                            asis.id_sede = sede.id_sede;
                            asis.sede = sede.nombre;
                            asis.direccion = sede.direccion;
                            asis.hora_inicio = turno.horario_inicio;
                            asis.hora_fin = turno.hora_fin;
                            const asisStartTime = new Date(
                              `1970-01-01T${asis.hora_inicio}:00Z`
                            );
                            const asisStartTime1 = new Date(
                              `1970-01-01T${asis.hora_ini_1}:00Z`
                            );
                            if (asisStartTime > asisStartTime1) {
                              console.log(asis);
                              this.asistencias.push(asis);
                              this.asistencias.sort(
                                (a, b) => b.id_asistencia - a.id_asistencia
                              );

                              console.log(this.asistencias);
                            }
                     

                            console.log(this.asistencias);
                          });
                      });
                  }
                });
            });
        });
      });
  }

  getSedes() {
    this.http
      .get(`https://osolices.pythonanywhere.com/sede/`)
      .subscribe((sede: any) => {
        console.log(sede);

        this.sedes.push(...sede);
      });
  }

  getNombreSede(id_sede: any) {
    this.http
      .get(`https://osolices.pythonanywhere.com/sede/${id_sede}/`)
      .subscribe((sede: any) => {
        console.log(sede);

        this.currentNombreSede = sede.nombre;
      });
  }

  openModalFecha() {
    this.showModal = true;
  }

  openModalSede() {
    this.getSedes();
    this.showModalSede = true;
  }

  onDidDismissFecha(event: CustomEvent) {
    console.log('Fecha seleccionada:', this.currentValue);
    this.showModal = false;
  }

  onDidDismissSede(event: CustomEvent) {
    console.log('Sede seleccionada:', this.currentValueSede);
    this.showModalSede = false;
  }

  onIonChange(event: CustomEvent) {
    this.currentValue = event.detail.value;
    this.asistencias = [];
    this.getAsistencias();
  }

  onSedeChange(event: CustomEvent) {
    this.currentValueSede = event.detail.value;
    this.getNombreSede(this.currentValueSede);
    this.asistencias = [];
    this.getAsistencias();
  }

  toast(mensaje: string) {
    const toast = document.createElement('ion-toast');
    toast.message = mensaje;
    toast.duration = 2000;
    toast.cssClass = 'my-toast'; // Añade esta línea

    document.body.appendChild(toast);
    return toast.present();
  }
  async confirmarCrear() {
    const result = await Swal.fire({
      title: 'Confirmación',
      text: '¿Estás seguro desea generar este informe?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, generar',
      cancelButtonText: 'No, cancelar',
      heightAuto: false,
      confirmButtonColor: 'rgb(57, 88, 134)',
    });

    if (result.isConfirmed) {
      
    }
  }
  
}
