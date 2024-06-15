import { filter } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../servicio/auth.service';
import { ModalController } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { IonSelect, IonTextarea, IonInput, IonModal  } from '@ionic/angular';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestionar-solicitud',
  templateUrl: './gestionar-solicitud.page.html',
  styleUrls: ['./gestionar-solicitud.page.scss'],
})
export class GestionarSolicitudPage implements OnInit {
  solicitud_modificada: any;
  solicitudes: any[] = [];
  comunas: any[] = [];
  comu: any;

  @ViewChild('modalRef') modal!: IonModal;
  @ViewChild('justificaciopnTextarea') justificaciopnTextarea!: IonTextarea;
  @ViewChild('nroInput') nroInput!: IonInput;
  @ViewChild('tipoInput') tipoInput!: IonInput;
  @ViewChild('estadoInput') estadoInput!: IonInput;

  @ViewChild('comunaSelectC') comunaSelectC!: IonSelect;
  @ViewChild('pNombreInputC') pNombreInputC!: IonInput;
  @ViewChild('correoInputC') correoInputC!: IonInput;
  @ViewChild('telefonoInputC') telefonoInputC!: IonInput;
  @ViewChild('direccionInputC') direccionInputC!: IonInput;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.getSolicitudes();
  }

  getSolicitudes() {
    this.http
      .get(`https://osolices.pythonanywhere.com/solicitud/`)
      .subscribe((solicitudes: any) => {
        solicitudes.forEach((sol: any) => {
          this.http
            .get(
              `https://osolices.pythonanywhere.com/tiposolicitud/${sol.id_tipo_sol}/`
            )
            .subscribe((tipo_sol: any) => {
              console.log(tipo_sol);

              sol.tipo_solicitud = tipo_sol.descripcion;

              this.solicitudes.push(sol);
              console.log(this.solicitudes);
            });
        });
      });
  }

  async confirmarActualizar(id_solicitud: any) {
    const result = await Swal.fire({
      title: 'Confirmación',
      text: '¿Estás seguro desea modificar este turno?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, modificar',
      cancelButtonText: 'No, cancelar',
      heightAuto: false,
      confirmButtonColor: 'rgb(57, 88, 134)',
    });

    if (result.isConfirmed) {
      await this.actualizarSede(id_solicitud);
    }
  }

  actualizarSede(id_solicitud: any) {
    const userData = window.localStorage.getItem('userData');
    console.log(userData);
    if (userData) {
      const rut= JSON.parse(userData).rut_admin;
      const nro = this.nroInput.value;
      const tipo = this.tipoInput.value;
      const justificacion = this.justificaciopnTextarea.value || 'Sin Justificación';
      const estado= this.solicitud_modificada.estado;
      const detalle =this.solicitud_modificada.detalle_solicitud;
      const fecha =this.solicitud_modificada.fecha;
      const id_tipo_sol =this.solicitud_modificada.id_tipo_sol;
      const rut_guardia =this.solicitud_modificada.rut_guarida;

      console.log(nro);
      console.log(tipo);
      console.log(justificacion);
      console.log(rut);
      console.log(estado);
      console.log(detalle);
      console.log(fecha);
      console.log(id_tipo_sol);
      console.log(rut_guardia);

      const body = {
        id_solicitud: nro,
        detalle_solicitud: detalle,
        fecha: fecha,
        justificacion: justificacion,
        estado: estado,
        id_tipo_sol: id_tipo_sol,
        rut_admin: rut,
        rut_guarida: rut_guardia
      };
      this.http
        .put(`https://osolices.pythonanywhere.com/solicitud/${id_solicitud}/`, body)
        .subscribe(
          (response) => {
            console.log(response);
            this.toast('Solicitud modificada exitosamente');
            this.solicitudes = [];
            this.getSolicitudes();
            this.modalController.dismiss();
          },
          (error) => {
            console.error(error);
            this.toast('Error al modificar');
          }
        );
    }
  }

  cambiarEstado(solicitud: any , tipo:any) {
    this.solicitud_modificada = {}; // Inicializa como objeto
    console.log(solicitud);
    if (tipo==='aprobar') {
      solicitud.estado = 'Aprobada';
    } else{
      solicitud.estado = 'Rechazada';
    }
    
    console.log(solicitud);
    this.solicitud_modificada = solicitud; // Asigna el objeto modificado
    console.log(this.solicitud_modificada);
  }

  async abrirModalRechazo(solicitud: any) {
    this.cambiarEstado(solicitud, 'rechazar');
    await this.modal.present();
  }

  async abrirModalApruebo(solicitud: any) {
    this.cambiarEstado(solicitud, 'aprobar');
    await this.modal.present();
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
