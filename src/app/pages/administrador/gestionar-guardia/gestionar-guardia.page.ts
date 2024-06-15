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
  selector: 'app-gestionar-guardia',
  templateUrl: './gestionar-guardia.page.html',
  styleUrls: ['./gestionar-guardia.page.scss'],
})
export class GestionarGuardiaPage implements OnInit {
  guardias: any[] = [];
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
  
  @ViewChild('sedeSelectC') sedeSelectC!: IonSelect;
  @ViewChild('fechaInputC') fechaInputC!: IonInput;
  @ViewChild('ctdGuardiasInputC') ctdGuardiasInputC!: IonInput;
  @ViewChild('horaIniInputC') horaIniInputC!: IonInput;
  @ViewChild('horaFinInputC') horaFinInputC!: IonInput;
  @ViewChild('remuInputC') remuInputC!: IonInput;
  @ViewChild('sedeIDC') sedeIDC!: IonInput;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.getGuardias();
  }

  getGuardias() {
    this.http
      .get(`https://osolices.pythonanywhere.com/guardia/`)
      .subscribe((guardias: any) => {
        guardias.forEach((guardia: any) => {
          this.http
            .get(
              `https://osolices.pythonanywhere.com/comuna/${guardia.id_comuna}/`
            )
            .subscribe((comuna: any) => {
              console.log(comuna);

              guardia.comuna = comuna.descripcion;

              this.guardias.push(guardia);
              console.log(this.guardias);
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
    const comuna_new = this.comunaSelect.value ? this.comunaSelect.value.id_comuna : this.comunaID.value;
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
          this.guardias = [];
          this.getGuardias();
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
          this.guardias = [];
          this.getGuardias();
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
      await this.crearTurno();
    }
  }

  crearTurno() {
    console.log(this.sedeSelectC.value.id_sede);

    const sede = this.sedeSelectC.value.id_sede;
    const fecha = this.fechaInputC.value;
    const hora_ini = this.horaIniInputC.value;
    const hora_fin = this.horaFinInputC.value;
    const remuneracion = this.remuInputC.value;
    const ctd_guardias = this.ctdGuardiasInputC.value;

    console.log(sede);
    console.log(fecha);
    console.log(hora_ini);
    console.log(hora_fin);
    console.log(remuneracion);
    console.log(ctd_guardias);

    const autenti = {
      nombre_usuario: 1,
      contrasena: '12345',
      id_perfil: 1,
    };
    this.http
      .post(`https://oosolices.pythonanywhere.com/atentificar/`, autenti)
      .subscribe(
        (response) => {
          console.log(response);
          this.toast('Turno Modificado exitosamente');
          this.modalController.dismiss();
        },
        (error) => {
          console.error(error);
          this.toast('Error al modificar');
        }
      );
    const body = {
      fecha: fecha,
      horario_inicio: hora_ini,
      hora_fin: hora_fin,
      remuneracion: remuneracion,
      ctd_guardias: ctd_guardias,
      id_sede: sede,
    };

    this.http
      .post(`https://osolices.pythonanywhere.com/turno/`, body)
      .subscribe(
        (response) => {
          console.log(response);
          this.toast('Turno creado exitosamente');
          this.guardias = [];
          this.getGuardias();
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
