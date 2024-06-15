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
  selector: 'app-gestionar-sede',
  templateUrl: './gestionar-sede.page.html',
  styleUrls: ['./gestionar-sede.page.scss'],
})
export class GestionarSedePage implements OnInit {
  sedes: any[] = [];
  comunas: any[] = [];
  comu: any;
  @ViewChild('comunaSelect') comunaSelect!: IonSelect;
  @ViewChild('pNombreInput') pNombreInput!: IonInput;
  @ViewChild('correoInput') correoInput!: IonInput;
  @ViewChild('telefonoInput') telefonoInput!: IonInput;
  @ViewChild('direccionInput') direccionInput!: IonInput;
  @ViewChild('comunaID') comunaID!: IonInput;
  @ViewChild('autentiID') autentiID!: IonInput;

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
    this.getSedes();
  }

  getSedes() {
    this.http
      .get(`https://osolices.pythonanywhere.com/sede/`)
      .subscribe((sedes: any) => {
        sedes.forEach((sede: any) => {
          this.http
            .get(
              `https://osolices.pythonanywhere.com/comuna/${sede.id_comuna}/`
            )
            .subscribe((comuna: any) => {
              console.log(comuna);

              sede.comuna = comuna.descripcion;

              this.sedes.push(sede);
              console.log(this.sedes);
            });
        });
      });
  }

  obtenerComunas() {
    this.comunas = [];
    this.http
      .get(`https://osolices.pythonanywhere.com/comuna/`)
      .subscribe((comunas: any) => {
        console.log(comunas);
        this.comunas.push(...comunas);
        console.log(this.comunas);
      });
  }

  async confirmarActualizar(id_sede: any) {
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
      await this.actualizarSede(id_sede);
    }
  }

  actualizarSede(id_sede: any) {
    const nombre = this.pNombreInput.value;
    const correo = this.correoInput.value;
    const telefono = this.telefonoInput.value;
    const direccion = this.direccionInput.value;
    const comuna_old = this.comunaID.value;
    const comuna_new = this.comunaSelect.value
      ? this.comunaSelect.value.id_comuna
      : this.comunaID.value;
    if (comuna_old !== comuna_new) {
      this.comu = comuna_new;
    } else {
      this.comu = comuna_old;
    }

    console.log(nombre);
    console.log(correo);
    console.log(telefono);
    console.log(direccion);
    console.log(this.comu);

    const body = {
      nombre: nombre,
      correo: correo,
      telefono: telefono,
      direccion: direccion,
      foto: '../../../assets/img/sede/sede.png',
      id_comuna: this.comu,
    };
    this.http
      .put(`https://osolices.pythonanywhere.com/sede/${id_sede}/`, body)
      .subscribe(
        (response) => {
          console.log(response);
          this.toast('Sede modificada exitosamente');
          this.sedes = [];
          this.getSedes();
          this.modalController.dismiss();
        },
        (error) => {
          console.error(error);
          this.toast('Error al modificar');
        }
      );
  }

  async confirmarEliminar(id_sede: any) {
    const result = await Swal.fire({
      title: 'Confirmación',
      text: '¿Estás seguro desea eliminar esta sede?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
      heightAuto: false,
      confirmButtonColor: 'rgb(57, 88, 134)',
    });

    if (result.isConfirmed) {
      await this.eliminarGuardia(id_sede);
    }
  }

  eliminarGuardia(id_sede: any) {
    this.http
      .delete(`https://osolices.pythonanywhere.com/sede/${id_sede}/`)
      .subscribe(
        (response) => {
          console.log(response);
          this.toast('Sede eliminada exitosamente');
          this.sedes = [];
          this.getSedes();
        },
        (error) => {
          console.error(error);
          this.toast('Error al eliminar');
        }
      );
  }

  async confirmarCrear() {
    const result = await Swal.fire({
      title: 'Confirmación',
      text: '¿Estás seguro desea crear esta sede?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, crear',
      cancelButtonText: 'No, cancelar',
      heightAuto: false,
      confirmButtonColor: 'rgb(57, 88, 134)',
    });

    if (result.isConfirmed) {
      await this.crearSede();
    }
  }

  crearSede() {
    const nombre =
      (this.pNombreInputC.value as string)?.charAt(0).toUpperCase() +
        (this.pNombreInputC.value as string)?.slice(1).toLowerCase() ?? '';

    const correo = (this.correoInputC.value as string)?.toLowerCase() ?? '';
    const telefono = this.telefonoInputC.value ?? '';
    const direccion = this.direccionInputC.value ?? '';
    const comuna_new = this.comunaSelectC.value
      ? this.comunaSelectC.value.id_comuna
      : 1;

    const body = {
      nombre: nombre,
      direccion: direccion,
      telefono: telefono,
      correo: correo,
      foto: '../../../assets/img/sede/sede.png',
      id_comuna: comuna_new,
    };
        this.http
          .post(`https://osolices.pythonanywhere.com/sede/`, body)
          .subscribe(
            (response) => {
              console.log(response);
              this.toast('Sede creada exitosamente');
              this.sedes = [];
              this.getSedes();
              this.modalController.dismiss();
            },
            (error) => {
              console.error(error);
              this.toast('Error al crear');
            }
          );
      
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
