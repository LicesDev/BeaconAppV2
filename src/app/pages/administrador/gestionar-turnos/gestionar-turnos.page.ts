import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../servicio/auth.service';
import { ModalController } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { IonSelect, IonTextarea } from '@ionic/angular';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-gestionar-turnos',
  templateUrl: './gestionar-turnos.page.html',
  styleUrls: ['./gestionar-turnos.page.scss'],
})
export class GestionarTurnosPage implements OnInit {
  turnos: any[] = [];
  sedes: any[] = [];
  
  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.getTurnos();
  }

  getTurnos() {
    this.http
      .get(`https://osolices.pythonanywhere.com/turno/`)
      .subscribe((turnos: any) => {
        turnos.forEach((turno: any) => {
          this.http.get(`https://osolices.pythonanywhere.com/sede/`).subscribe((sedeData: any) => {
            console.log(sedeData);
            const sede = sedeData.filter((sedeData: any) => sedeData.id_sede === turno.id_sede);
            const nombre = sede[0].nombre;
            const direccion = sede[0].direccion;
            const foto = sede[0].foto;
  
            console.log(nombre);
            console.log(direccion);
            console.log(foto);
  
            turno.nombre = nombre;
            turno.direccion = direccion;
            turno.foto = foto;
  
            this.turnos.push(turno);
          });
        }); 
      });
  }

  obtenerSedes(){
    this.sedes = [];
    this.http.get(`https://osolices.pythonanywhere.com/sede/`).subscribe((sedeData: any) => {
      console.log(sedeData);
      this.sedes.push(...sedeData);
      console.log(this.sedes)
    });
  }

  actualizarTurnos(){

  }

}
