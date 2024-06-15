import { filter } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../servicio/auth.service';
import { ModalController } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { IonSelect, IonTextarea, IonInput, IonDatetime } from '@ionic/angular';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestionar-solicitud',
  templateUrl: './gestionar-solicitud.page.html',
  styleUrls: ['./gestionar-solicitud.page.scss'],
})
export class GestionarSolicitudPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
