import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@capacitor/geolocation';
import { BleClient } from '@capacitor-community/bluetooth-le';
import { BackgroundTask } from '@capawesome/capacitor-background-task';
import { App } from '@capacitor/app';
import { Preferences } from '@capacitor/preferences';
import {
  BiometricAuth,
  AndroidBiometryStrength,
  BiometryError,
  BiometryErrorType,
} from '@aparajita/capacitor-biometric-auth';
import { ChangeDetectorRef } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import Swal from 'sweetalert2';
import { EmailComposer, OpenOptions } from 'capacitor-email-composer';
import { ModalController } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { IonSelect, IonTextarea } from '@ionic/angular';
import { filter } from 'rxjs';

@Component({
  selector: 'app-turno-activo',
  templateUrl: './turno-activo.page.html',
  styleUrls: ['./turno-activo.page.scss'],
})
export class TurnoActivoPage implements OnInit, AfterViewInit, OnDestroy {
  item1Expanded = false;
  asignacion: any;
  asistencias: any[] = [];
  asistencia: any[] = [];
  expandedItemIndex: number | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.asignacion = params;
    });
    this.asistenciaTurno() 

  }

  async ngAfterViewInit() {
   
  }

  ngOnDestroy() {
   
  }

  async asistenciaTurno() {
    console.log(this.asignacion)
    this.http
    .get(`https://osolices.pythonanywhere.com/asignacionturno/by_id_turno/?id_turno=${this.asignacion.id_turno}`)
    .subscribe(async (asistenciasTurno: any) => {
      console.log(asistenciasTurno);
  
      const promises = asistenciasTurno.map((asistencia:any) => {
        return new Promise((resolve, reject) => {
          const rut= asistencia.rut_guarida;
          console.log(rut)
          this.http.get(`https://osolices.pythonanywhere.com/guardia/`)
          .subscribe((guardias: any) => {
            const guardia = guardias.find((g: any) => g.rut_guarida === rut);
            console.log(guardia);
            if (guardia) {
              console.log("entre")
              asistencia.nombre = guardia.p_nombre;
              asistencia.apellido = guardia.p_apellido;
              console.log(asistencia)
              resolve(asistencia);
            } else {
              resolve(null);
            }
          });
        });
      });
  
      const results = await Promise.all(promises);
      this.asistencias = results.filter(result => result !== null);
      console.log(this.asistencias);
    });
  }
  
  async obtenerAsistencia(id_asignacion:any){
    this.asistencia = [];
    console.log(id_asignacion)
    this.http
    .get(`https://osolices.pythonanywhere.com/asistencia`)
    .subscribe(async (asistencias: any) => {
      console.log(asistencias);
      const asistencia = asistencias.find((g: any) => g.id_asignacion === id_asignacion);
      if (asistencia) {
        this.asistencia.push(asistencia);
      } else{
        this.toast('No ha iniciado Turno')
      }
      console.log(asistencia);
      console.log(this.asistencia);
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
