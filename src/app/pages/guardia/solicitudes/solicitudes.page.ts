import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../servicio/auth.service';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';
import { IonSelect, IonTextarea } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.page.html',
  styleUrls: ['./solicitudes.page.scss'],
})
export class SolicitudesPage implements OnInit {
  solicitudes: any[] = [];
  tipoSolicitudes?: string;
  tiposSolicitudes: any[] = [];
  @ViewChild('tipoSolicitudSelect') tipoSolicitudSelect!: IonSelect;
  @ViewChild('descripcionTextarea') descripcionTextarea!: IonTextarea;
  
  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.getsolicitudesGuardia();
    this.tipoSolicitud(); // Cargar los tipos de solicitud en ngOnInit
  }

  async getsolicitudesGuardia() {
    const userData = window.localStorage.getItem('userData');
    if (userData) {
      const rut = JSON.parse(userData).rut_guarida;
      try {
        const dataAs: any = await this.http
          .get('https://osolices.pythonanywhere.com/solicitud/')
          .toPromise();
        const solicitudesGuardia = dataAs.filter(
          (dataAs: any) => dataAs.rut_guarida === rut
        );
        solicitudesGuardia.sort((a: any, b: any) => b.id_solicitud - a.id_solicitud); // Ordenar por id_solicitud
        for (const solicitud of solicitudesGuardia) {
          try {
            const tipoSolicitud: any = await this.http
              .get(`https://osolices.pythonanywhere.com/tiposolicitud/${solicitud.id_tipo_sol}`)
              .toPromise();
            solicitud.descripcion_tipo = tipoSolicitud.descripcion;
          } catch (error) {
            console.error('Error fetching tipo solicitud', error);
            solicitud.descripcion_tipo = 'Tipo de solicitud no encontrado'; // O alguna descripción por defecto
          }
        }
        this.solicitudes = solicitudesGuardia;
        this.cd.detectChanges();
        console.log(this.solicitudes);
      } catch (error) {
        console.error('Error fetching data', error);
      }
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

  tipoSolicitud() {
    this.http
      .get(`https://osolices.pythonanywhere.com/tiposolicitud/`)
      .subscribe((data: any) => {
        this.tiposSolicitudes = data;
        console.log(this.tiposSolicitudes);
      });
  }

  async enviarSolicitud() {
    const userData = window.localStorage.getItem('userData');
    if (userData) {
      const rut = JSON.parse(userData).rut_guarida;
      try {
        const tipoSolicitud = this.tipoSolicitudSelect.value.id_tipo_sol;
        const descripcionSolicitud = this.tipoSolicitudSelect.value.descripcion;
        const descripcion = this.descripcionTextarea.value;

        console.log(tipoSolicitud);
        console.log(descripcion);

        if (tipoSolicitud && descripcion) {
          const fechaActual = new Date().toISOString().split('T')[0];
          let body = {
            fecha: fechaActual,
            detalle_solicitud: descripcion,
            id_tipo_sol: tipoSolicitud,
            rut_guarida: rut, // Añadir el rut a la solicitud
          };

          await this.http
            .post('https://osolices.pythonanywhere.com/solicitud/', body)
            .toPromise();
          this.modalController.dismiss();
          this.toast('Solicitud Generada');
          this.getsolicitudesGuardia(); // Recargar la vista después de generar la solicitud
        } else {
          this.toast('Por favor, complete todos los campos');
        }
      } catch (error) {
        console.error('Error al enviar la solicitud', error);
        this.toast('Error al generar la solicitud');
      }
    }
    this.cd.detectChanges();
  }
}
