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
  @ViewChild('sNombreInput') sNombreInput!: IonInput;
  @ViewChild('pApellidoInput') pApellidoInput!: IonInput;
  @ViewChild('sApellidoInput') sApellidoInput!: IonInput;
  @ViewChild('rutInput') rutInput!: IonInput;
  @ViewChild('fechaNacInput') fechaNacInput!: IonInput;
  @ViewChild('correoInput') correoInput!: IonInput;
  @ViewChild('telefonoInput') telefonoInput!: IonInput;
  @ViewChild('direccionInput') direccionInput!: IonInput;
  @ViewChild('comunaID') comunaID!: IonInput;
  @ViewChild('autentiID') autentiID!: IonInput;

  @ViewChild('comunaSelectC') comunaSelectC!: IonSelect;
  @ViewChild('pNombreInputC') pNombreInputC!: IonInput;
  @ViewChild('sNombreInputC') sNombreInputC!: IonInput;
  @ViewChild('pApellidoInputC') pApellidoInputC!: IonInput;
  @ViewChild('sApellidoInputC') sApellidoInputC!: IonInput;
  @ViewChild('rutInputC') rutInputC!: IonInput;
  @ViewChild('fechaNacInputC') fechaNacInputC!: IonInput;
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

  async confirmarActualizar(rut_guardia: any) {
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
      await this.actualizarguardias(rut_guardia);
    }
  }

  actualizarguardias(rut_guardia: any) {
    const p_nombre = this.pNombreInput.value;
    const s_nombre = this.sNombreInput.value;
    const p_apellido = this.pApellidoInput.value;
    const s_apellido = this.sApellidoInput.value;
    const fecha_nac = this.fechaNacInput.value;
    const correo = this.correoInput.value;
    const telefono = this.telefonoInput.value;
    const direccion = this.direccionInput.value;
    const comuna_old = this.comunaID.value;
    const comuna_new = this.comunaSelect.value
      ? this.comunaSelect.value.id_comuna
      : this.comunaID.value;
    const autentificar = this.autentiID.value;

    if (comuna_old !== comuna_new) {
      this.comu = comuna_new;
    } else {
      this.comu = comuna_old;
    }
    console.log(rut_guardia);
    console.log(p_nombre);
    console.log(s_nombre);
    console.log(p_apellido);
    console.log(s_apellido);
    console.log(fecha_nac);
    console.log(correo);
    console.log(telefono);
    console.log(direccion);
    console.log(this.comu);
    console.log(autentificar);

    const body = {
      rut_guarida: rut_guardia,
      p_nombre: p_nombre,
      s_nombre: s_nombre,
      p_apellido: p_apellido,
      s_apellido: s_apellido,
      fecha_nac: fecha_nac,
      correo: correo,
      telefono: telefono,
      direccion: direccion,
      foto_perfil: '../../../assets/img/perfil/perfil.png',
      id_comuna: this.comu,
      id_autentificar: autentificar,
    };
    this.http
      .put(`https://osolices.pythonanywhere.com/guardia/${rut_guardia}/`, body)
      .subscribe(
        (response) => {
          console.log(response);
          this.toast('Guardia Modificado exitosamente');
          this.modalController.dismiss();
          this.sedes = [];
          this.getSedes();
        },
        (error) => {
          console.error(error);
          this.toast('Error al modificar');
        }
      );
  }

  async confirmarEliminar(rut_guardia: any) {
    const result = await Swal.fire({
      title: 'Confirmación',
      text: '¿Estás seguro desea eliminar este turno?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
      heightAuto: false,
      confirmButtonColor: 'rgb(57, 88, 134)',
    });

    if (result.isConfirmed) {
      await this.eliminarGuardia(rut_guardia);
    }
  }

  eliminarGuardia(rut_guardia: any) {
    this.http
      .delete(`https://osolices.pythonanywhere.com/guardia/${rut_guardia}/`)
      .subscribe(
        (response) => {
          console.log(response);
          this.toast('Guardia eliminado exitosamente');
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
      text: '¿Estás seguro desea crear este turno?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, crear',
      cancelButtonText: 'No, cancelar',
      heightAuto: false,
      confirmButtonColor: 'rgb(57, 88, 134)',
    });

    if (result.isConfirmed) {
      await this.crearGuardia();
    }
  }

  crearGuardia() {
    const p_nombre =
      (this.pNombreInputC.value as string)?.charAt(0).toUpperCase() +
        (this.pNombreInputC.value as string)?.slice(1).toLowerCase() ?? '';
    const s_nombre =
      (this.sNombreInputC.value as string)?.charAt(0).toUpperCase() +
        (this.sNombreInputC.value as string)?.slice(1).toLowerCase() ?? '';
    const p_apellido =
      (this.pApellidoInputC.value as string)?.charAt(0).toUpperCase() +
        (this.pApellidoInputC.value as string)?.slice(1).toLowerCase() ?? '';
    const s_apellido =
      (this.sApellidoInputC.value as string)?.charAt(0).toUpperCase() +
        (this.sApellidoInputC.value as string)?.slice(1).toLowerCase() ?? '';
    const fecha_nac = this.fechaNacInputC.value ?? '';
    const correo = (this.correoInputC.value as string)?.toLowerCase() ?? '';
    const telefono = this.telefonoInputC.value ?? '';
    const direccion = this.direccionInputC.value ?? '';
    const rut = this.rutInputC.value ?? '';
    const comuna_new = this.comunaSelectC.value
      ? this.comunaSelectC.value.id_comuna
      : 1;

    const password = rut as string; // La contraseña que quieres hashear
    const hashedPassword = CryptoJS.SHA256(password).toString();

    const usuario = p_nombre.toLowerCase() + '.' + p_apellido.toLowerCase();
    const body = {
      nombre_usuario: usuario,
      contrasena: hashedPassword,
      id_perfil: 2,
    };
    console.log(hashedPassword);

    interface AutentificarResponse {
      id_autentificar: number;
    }
    this.http
      .post(`https://osolices.pythonanywhere.com/autentificar/`, body)
      .subscribe(
        (response:any) => {
          console.log(response as AutentificarResponse);
          const autentificar = response.id_autentificar;
          const body = {
            rut_guarida: rut,
            p_nombre: p_nombre,
            s_nombre: s_nombre,
            p_apellido: p_apellido,
            s_apellido: s_apellido,
            fecha_nac: fecha_nac,
            correo: correo,
            telefono: telefono,
            direccion: direccion,
            foto_perfil: '../../../assets/img/perfil/perfil.png',
            id_comuna: comuna_new,
            id_autentificar: autentificar,
          };

          this.http
            .post(`https://osolices.pythonanywhere.com/guardia/`, body)
            .subscribe(
              (response) => {
                console.log(response);
                this.toast('Guardia creado exitosamente');
                this.sedes = [];
                this.getSedes();
                this.modalController.dismiss();
              },
              (error) => {
                console.error(error);
                this.toast('Error al crear');
              }
            );
        },
        (error) => {
          console.error(error);
          this.toast('Error al crear el usuario');
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

