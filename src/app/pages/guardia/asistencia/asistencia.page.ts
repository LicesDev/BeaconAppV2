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
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage implements OnInit, AfterViewInit, OnDestroy {
  valorDescuento:any;
  descuento:any;
  nombre: any;
  usuario: any = {};
  asistencia: any[] = [];
  asignacion: any;
  lat?: number;
  lng?: number;
  timestamp?: number;
  cercania= false;
  botonTurnoHabilitado = false;
  botonColacionHabilitado = false;
  botonPermanenciaHabilitado = false;
  botonIncidenciaHabilitado = false;
  botonFinColacionHabilitado = false;
  intervalId: any;
  timeoutId: any;
  ubicacionGuardiaTask: any;
  ubicacionGuardiaTaskInterval = 10 * 60 * 1000;
  tiempoRestante = 2 * 60 * 60;
  incidencias: any[] = [];
  tipoIncidencia?: string;
  descripcion?: string;
  evidencia?: File;
  @ViewChild('tipoIncidenciaSelect') tipoIncidenciaSelect!: IonSelect;
  @ViewChild('descripcionTextarea') descripcionTextarea!: IonTextarea;

  constructor(
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    
    emailjs.init('4PuoT7FOO-_P4NBIr');
    this.route.queryParams.subscribe((params) => {
      this.asignacion = params;
    });
    
    await Preferences.set({ key: 'turnoIniciado', value: 'false' });
    await this.obtenerUbicacionGuardia();

    // Recuperar el estado del contador del almacenamiento local solo cuando se inicializa el componente
    const { value } = await Preferences.get({ key: 'tiempoRestante' });
    this.tiempoRestante = value ? Number(value) : 2 * 60 * 60;

    // Configurar el listener de estado de la aplicación
    App.addListener('appStateChange', async ({ isActive }) => {
      if (isActive) {
        const { value: botonBuscarVisible } = await Preferences.get({
          key: 'botonBuscarVisible',
        });
        // Recuperar el estado de los botones del almacenamiento local
        const { value: botonComenzarVisible } = await Preferences.get({
          key: 'botonComenzarVisible',
        });
        const { value: botonFinalizarVisible } = await Preferences.get({
          key: 'botonFinalizarVisible',
        });
        let buscar = document.getElementById('buscando');
        let comenzar = document.getElementById('asistencia');
        let finalizar = document.getElementById('finalizar');
        if (buscar) {
          buscar.style.display = botonBuscarVisible === 'none' ? 'none' : '';
        }
        if (comenzar) {
          comenzar.style.display = botonComenzarVisible === '' ? '' : 'none';
        }
        if (finalizar) {
          finalizar.style.display = botonFinalizarVisible === '' ? '' : 'none';
        }
        const { value: botonIniColacionVisible } = await Preferences.get({
          key: 'botonIniColacionVisible',
        });
        const { value: botonFinColacionVisible } = await Preferences.get({
          key: 'botonFinColacionVisible',
        });

        let ini_colacion = document.getElementById('ini_colacion');
        if (ini_colacion) {
          ini_colacion.style.display =
            botonIniColacionVisible === 'none' ? 'none' : '';
        }
        let fin_colacion = document.getElementById('fin_colacion');
        if (fin_colacion) {
          fin_colacion.style.display =
            botonFinColacionVisible === '' ? '' : 'none';
        }

        const { value: botonColacionHabilitado } = await Preferences.get({
          key: 'botonColacionHabilitado',
        });
        const { value: botonIncidenciaHabilitado } = await Preferences.get({
          key: 'botonIncidenciaHabilitado',
        });
        this.botonColacionHabilitado = botonColacionHabilitado === 'true';
        this.botonIncidenciaHabilitado = botonIncidenciaHabilitado === 'true';
      } else {
        // Guardar el estado del contador en el almacenamiento local cuando la aplicación se minimiza o cierra
        await Preferences.set({
          key: 'tiempoRestante',
          value: this.tiempoRestante.toString(),
        });
      }
    });
  }

  async ngAfterViewInit() {
    setTimeout(() => {
      this.detectDevice();
      this.detectCercania();
    }, 4000);
    // Recuperar el estado de los botones del almacenamiento local
    const { value: botonBuscarVisible } = await Preferences.get({
      key: 'botonBuscarVisible',
    });
    // Recuperar el estado de los botones del almacenamiento local
    const { value: botonComenzarVisible } = await Preferences.get({
      key: 'botonComenzarVisible',
    });
    const { value: botonFinalizarVisible } = await Preferences.get({
      key: 'botonFinalizarVisible',
    });
    let buscar = document.getElementById('buscando');
    let comenzar = document.getElementById('asistencia');
    let finalizar = document.getElementById('finalizar');
    if (buscar) {
      buscar.style.display = botonBuscarVisible === 'none' ? 'none' : '';
    }
    if (comenzar) {
      comenzar.style.display = botonComenzarVisible === '' ? '' : 'none';
    }
    if (finalizar) {
      finalizar.style.display = botonFinalizarVisible === '' ? '' : 'none';
    }
    const { value: botonIniColacionVisible } = await Preferences.get({
      key: 'botonIniColacionVisible',
    });
    const { value: botonFinColacionVisible } = await Preferences.get({
      key: 'botonFinColacionVisible',
    });

    let ini_colacion = document.getElementById('ini_colacion');
    if (ini_colacion) {
      ini_colacion.style.display =
        botonIniColacionVisible === 'none' ? 'none' : '';
    }
    let fin_colacion = document.getElementById('fin_colacion');
    if (fin_colacion) {
      fin_colacion.style.display = botonFinColacionVisible === '' ? '' : 'none';
    }
    const { value: botonColacionHabilitado } = await Preferences.get({
      key: 'botonColacionHabilitado',
    });
    const { value: botonIncidenciaHabilitado } = await Preferences.get({
      key: 'botonIncidenciaHabilitado',
    });
    this.botonColacionHabilitado = botonColacionHabilitado === 'true';
    this.botonIncidenciaHabilitado = botonIncidenciaHabilitado === 'true';

    // Recuperar el estado del contador del almacenamiento local cuando la aplicación vuelve a estar activa
    const { value } = await Preferences.get({ key: 'tiempoRestante' });
    this.tiempoRestante = value ? Number(value) : this.tiempoRestante;

    // Recuperar la hora de finalización del almacenamiento local
    const { value: endTimeValue } = await Preferences.get({ key: 'endTime' });
    const endTime = endTimeValue ? Number(endTimeValue) : null;

    // Si el temporizador ya ha sido iniciado (es decir, endTime no es null y tiempoRestante es menor que 2 horas), entonces reiniciar el contador
    if (endTime && this.tiempoRestante < 2 * 60 * 60) {
      this.startCounter();
    }
  }

  ngOnDestroy() {
    this.stopCounter();
  }

  async obtenerUbicacionGuardia() {
    try {
      const options: PositionOptions = {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      };
      const coordinates = await Geolocation.getCurrentPosition(options);
      this.lat = coordinates.coords.latitude;
      this.lng = coordinates.coords.longitude;
      this.timestamp = coordinates.timestamp;
      console.log('Ubicación del guardia:', this.lat, this.lng);
    } catch (error) {
      console.error('Error al obtener la ubicación del guardia:', error);
    }
  }
  // Método para iniciar el temporizador
  startCounter() {
    // Asegurarse de que no hay otros intervalos ejecutándose antes de crear uno nuevo
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(async () => {
      // Calcular el tiempo restante
      this.tiempoRestante = await this.getRemainingTime();

      if (this.tiempoRestante > 0) {
        this.tiempoRestante--;

        // Guardar el estado del contador en el almacenamiento local cada segundo
        await Preferences.set({
          key: 'tiempoRestante',
          value: this.tiempoRestante.toString(),
        });

        this.cd.detectChanges(); // Detectar los cambios
      } else {
        clearInterval(this.intervalId);
        this.botonPermanenciaHabilitado = true;
        this.cd.detectChanges();
        this.alertaPermanencia();

        // Iniciar un temporizador para ejecutar automáticamente finalizarTurno() después de 5 minutos
        this.timeoutId = setTimeout(() => {
          this.alerta(
            'Turno Finalizado',
            'Se finalizo el turno por no marcación'
          );
          this.finalizarTurno();
        }, 5 * 60 * 1000);
      }
    }, 1000);
  }
  // Método para obtener el tiempo restante
  async getRemainingTime() {
    // Recuperar la hora tope del almacenamiento persistente
    const { value } = await Preferences.get({ key: 'endTime' });
    const endTime = value ? Number(value) : null;

    if (endTime) {
      // Calcular el tiempo restante
      const now = new Date().getTime();
      const remainingTime = endTime - now; // en milisegundos

      return remainingTime > 0 ? Math.round(remainingTime / 1000) : 0; // convertir a segundos
    } else {
      return 2 * 60 * 60; // 2 horas en segundos
    }
  }
  alerta(mensaje: string, cuerpo: string) {
    const notificationId = Math.floor(Math.random() * 1000000);
    const now = new Date(); // Crear un nuevo objeto Date con la hora actual

    LocalNotifications.schedule({
      notifications: [
        {
          id: notificationId,
          title: mensaje,
          body: cuerpo,
          schedule: { at: now },
        },
      ],
    });
  }
  alertaPermanencia() {
    // Programar una notificación para dentro de 2 horas
    const notificationId = Math.floor(Math.random() * 1000000);
    const twoHoursFromNow = new Date(new Date().getTime() + 2 * 60 * 60 * 1000); // 2 horas después

    LocalNotifications.schedule({
      notifications: [
        {
          id: notificationId,
          title: 'Permanencia',
          body: 'Debes marcar la permanencia.',
          schedule: { at: twoHoursFromNow },
        },
      ],
    });
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  stopCounter() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  async detectDevice() {
    try {
      console.log('INICIALIZANDO BLUETOOTH');
      await BleClient.initialize();

      console.log('VERIFICANDO ESTADO DEL BLUETOOTH');
      const isEnabled = await BleClient.isEnabled();
      if (!isEnabled) {
        console.log('BLUETOOTH NO ESTÁ ACTIVADO');
        if (BleClient.requestEnable) {
          await BleClient.requestEnable();
        }
        return;
      }

      console.log('ESCANEANDO');
      const targetDeviceName = 'Sede Test';
      let deviceFound = false;

      while (!deviceFound) {
        await BleClient.requestLEScan(
          { name: targetDeviceName },
          (scanResult) => {
            if (
              scanResult.device &&
              scanResult.device.name === targetDeviceName
            ) {
              console.log('BALIZA OBJETIVO ENCONTRADA:', scanResult.device);

              this.botonTurnoHabilitado = true;
              deviceFound = true;
              let buscar = document.getElementById('buscando');
              if (buscar) {
                buscar.style.display = 'none';
                Preferences.set({
                  key: 'botonBuscarVisible',
                  value: 'none',
                });
              }
              let comenzar = document.getElementById('asistencia');
              if (comenzar) {
                comenzar.style.display = '';
                Preferences.set({
                  key: 'botonComenzarVisible',
                  value: '',
                });
                this.cd.detectChanges();
              }
            }
          }
        );

        await new Promise((resolve) => setTimeout(resolve, 5000));
        if (!deviceFound) {
          console.log('Dispositivo no encontrado, reintentando...');
          BleClient.stopLEScan();
        }
      }
    } catch (error) {
      console.error('Error al inicializar el Bluetooth:', error);
    }
  }

  async detectCercania() {
    const sedeLat = -33.5984757;
    const sedeLng = -70.5781949;
    const radio = 0.1; // Define el radio en kilómetros
  
    try {
      const options: PositionOptions = {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      };
      const coordinates = await Geolocation.getCurrentPosition(options);
      const guardiaLat = coordinates.coords.latitude;
      const guardiaLng = coordinates.coords.longitude;
  
      // Calcula la distancia usando la fórmula de Haversine
      const R = 6371; // Radio de la Tierra en kilómetros
      const dLat = this.degreesToRadians(guardiaLat - sedeLat);
      const dLng = this.degreesToRadians(guardiaLng - sedeLng);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.degreesToRadians(sedeLat)) * Math.cos(this.degreesToRadians(guardiaLat)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distancia = R * c;
  
      if (distancia <= radio) {
        console.log('El guardia está cerca del punto.');
        this.toast('Baliza detectada')
        this.cercania=true;
      } else {
        this.toast('Estas lejos de la baliza')
        console.log('El guardia no está cerca del punto.');
      }
    } catch (error) {
      console.error('Error al obtener la ubicación del guardia:', error);
    }
  }
  
  // Función auxiliar para convertir grados a radianes
  degreesToRadians(degrees: number) {
    return degrees * (Math.PI / 180);
  }
  async calcularDescuento(){
    console.log('entre')
    console.log(this.asignacion.hora_inicio)
    // Obtiene la fecha y hora actual en el formato correcto
    const ahora = moment().tz('America/Santiago');
  
    // Parsea la hora de inicio de la asignación
    const horaAsignacion = moment(this.asignacion.hora_inicio, 'HH:mm');
  
    // Calcula la diferencia en minutos
    const diferencia = ahora.diff(horaAsignacion, 'minutes');
  
    console.log(`La diferencia en minutos es: ${diferencia}`);
if (diferencia<=0) {
  this.descuento=1;
}if (diferencia>=15) {
  this.descuento=2;
  this.toast('Atraso Leve')
}if (diferencia>=30) {
  this.descuento=3;
  this.toast('Atraso Grave')
}
this.http
.get(`https://osolices.pythonanywhere.com/descuento/${this.descuento}/`)
.subscribe(
  (descuento: any) => {
    console.log(descuento)
    this.valorDescuento = descuento.valor_dcto;
    console.log(this.valorDescuento)
  });

  }

  async confirmarComenzarTurno() {
    const result = await Swal.fire({
      title: 'Confirmación',
      text: '¿Estás seguro de que quieres comenzar el turno?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, comenzar',
      cancelButtonText: 'No, cancelar',
      heightAuto: false,
      confirmButtonColor: 'rgb(57, 88, 134)',
    });

    if (result.isConfirmed) {
      await this.comenzarTurno();
    }
  }
  enviarCorreo(to_name: string, from_name: string, message: string) {
    let templateParams = {
      to_name: to_name,
      from_name: from_name,
      message: message,
    };

    emailjs.send('service_v7c3lup', 'template_piu6cqs', templateParams)
      .then(response => {
        console.log('Correo enviado!', response.status, response.text);
      }, error => {
        console.log('Falló el envío del correo:', error);
      });
  }
  async comenzarTurno() {
    console.log('Turno Comenzado');

    // Autenticación por huella dactilar
    try {
      await BiometricAuth.authenticate({
        reason: 'Por favor autentícate',
        cancelTitle: 'Cancelar',
        allowDeviceCredential: true,
        iosFallbackTitle: 'Usar PIN',
        androidTitle: 'Autenticación biométrica',
        androidSubtitle: 'Inicia sesión usando autenticación biométrica',
        androidConfirmationRequired: false,
        androidBiometryStrength: AndroidBiometryStrength.weak,
      });

      // Si la autenticación es exitosa, procedemos con el resto del método
      // Ocultar botón de comenzar y mostrar botón de finalizar
      let comenzar = document.getElementById('asistencia');
      if (comenzar) {
        comenzar.style.display = 'none';
        await Preferences.set({
          key: 'botonComenzarVisible',
          value: 'none',
        });
      }
      let finalizar = document.getElementById('finalizar');
      if (finalizar) {
        finalizar.style.display = '';
        await Preferences.set({
          key: 'botonFinalizarVisible',
          value: '',
        });
      }
      const userData = window.localStorage.getItem('userData');

      this.cd.detectChanges(); // Detectar los cambios
      // Habilitar botones de colación e incidencia
      this.botonColacionHabilitado = true;
      this.botonIncidenciaHabilitado = true;
      await Preferences.set({
        key: 'botonColacionHabilitado',
        value: 'true',
      });
      await Preferences.set({
        key: 'botonIncidenciaHabilitado',
        value: 'true',
      });
      this.cd.detectChanges();
      // Obtener la hora actual y calcular la hora tope (2 horas en el futuro)
      const now = new Date();
      const endTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 horas después
      
      if (userData) {
        const parsedData = JSON.parse(userData);
        const pNombre = parsedData.p_nombre;
        const pApellido = parsedData.p_apellido;
        this.nombre = `${pNombre} ${pApellido}`;
        
      }
      
      this.enviarCorreo('Daniel Santelices', this.nombre, 'El guardia comenzo su turno en la sede '+this.asignacion.nombre+' el día '+ now +'');
      // Guardar la hora tope en el almacenamiento persistente
      await Preferences.set({
        key: 'endTime',
        value: endTime.getTime().toString(),
      });
      await Preferences.set({ key: 'turnoIniciado', value: 'true' });
      this.iniciarSeguimientoUbicacionGuardia();
      // Iniciar el temporizador
      this.startCounter();
      // Obtener la hora actual y formatearla como "HH:MM"
      const horaActual = new Date();
      const horas = horaActual.getHours().toString().padStart(2, '0');
      const minutos = horaActual.getMinutes().toString().padStart(2, '0');
      const horaFormateada = `${horas}:${minutos}`;
      await this.calcularDescuento();
      // Obtener id_asignacion
      const idAsignacion = this.asignacion?.id_asignacion;
      const remuneracion = (this.asignacion?.remuneracion * this.valorDescuento) + this.asignacion?.remuneracion;
      // Construir el cuerpo de la solicitud
      const body = {
        hora_ini_1: horaFormateada,
        hora_fin_1: null,
        hora_ini_2: null,
        hora_fin_2: null,
        remuneracion_final: remuneracion,
        id_descuento: this.descuento,
        id_asignacion: idAsignacion,
      };

      console.log(body);
      interface AsistenciaResponse {
        id_asistencia: number;
        hora_ini_1: string;
        hora_fin_1: string | null;
        hora_ini_2: string | null;
        hora_fin_2: string | null;
        remuneracion_final: number | null;
        id_descuento: number;
        id_asignacion: number;
      }
      // Realizar la solicitud POST a la API
      this.http
        .post('https://osolices.pythonanywhere.com/asistencia/', body)
        .subscribe(
          (response: any) => {
            const asistenciaResponse = response as AsistenciaResponse;
            console.log('Respuesta de la API:', asistenciaResponse);
            // Guardar todos los datos de la asistencia en el almacenamiento local
            Preferences.set({
              key: 'asistencia',
              value: JSON.stringify(asistenciaResponse),
            });
            this.toast('Turno Iniciado');
          },
          (error) => {
            console.error('Error al realizar la solicitud POST:', error);
          }
        );
    } catch (error) {
      if (error instanceof BiometryError) {
        if (error.code !== BiometryErrorType.userCancel) {
          console.error(
            'Error en la autenticación por huella dactilar:',
            error.message
          );
        }
      }
    }
  }

  async permanencia() {
    // Detener el temporizador de finalización automática
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    // Restablecer el temporizador y desactivar el botón de permanencia
    this.tiempoRestante = 2 * 60 * 60;
    this.botonPermanenciaHabilitado = false;
    // Reiniciar el contador
    this.startCounter();
    this.cd.detectChanges();
  }



  toast(mensaje: string) {
    const toast = document.createElement('ion-toast');
    toast.message = mensaje;
    toast.duration = 2000;
    toast.cssClass = 'my-toast'; // Añade esta línea

    document.body.appendChild(toast);
    return toast.present();
  }

  async iniciarSeguimientoUbicacionGuardia() {
    this.ubicacionGuardiaTask = setInterval(async () => {
      try {
        // Obtener la ubicación actual del guardia
        const coordinates = await Geolocation.getCurrentPosition();
        const latitud = coordinates.coords.latitude;
        const longitud = coordinates.coords.longitude;

        // Enviar la ubicación del guardia al servidor
        await this.enviarUbicacionGuardia(latitud, longitud);
      } catch (error) {
        console.error(
          'Error en el seguimiento de ubicación del guardia:',
          error
        );
      }
    }, this.ubicacionGuardiaTaskInterval);

    // Ejecutar la primera vez inmediatamente
    await this.ubicacionGuardiaTask();
  }

  async enviarUbicacionGuardia(latitud: number, longitud: number) {
    try {
      let body: any; // Declara 'body' aquí

      interface AsistenciaResponse {
        id_asistencia: number;
        hora_ini_1: string;
        hora_fin_1: string | null;
        hora_ini_2: string | null;
        hora_fin_2: string | null;
        remuneracion_final: number | null;
        id_descuento: number;
        id_asignacion: number;
      }
      const { value } = await Preferences.get({ key: 'asistencia' });
      const turnoIniciado = await Preferences.get({ key: 'turnoIniciado' });
      if (value !== null) {
        const asistencia = JSON.parse(value) as AsistenciaResponse;
        const userData = window.localStorage.getItem('userData');
        if (userData) {
          const rut = JSON.parse(userData).rut_guarida;
          body = {
            rut_guarida: rut,
            id_turno: asistencia.id_asignacion.toString(),
            latitud: latitud,
            longitud: longitud,
          };
        }

        if (turnoIniciado.value === 'false') {
          this.http
            .post('https://osolices.pythonanywhere.com/ubicacionguardia/', body)
            .subscribe((response: any) => {
              Preferences.set({
                key: 'id_ubicacion',
                value: response.id_ubicacion.toString(),
              });
              console.log('Respuesta:', response.id_ubicacion.toString());
            });

          console.log(
            'Ubicación del guardia enviada (POST):',
            latitud,
            longitud
          );
          await Preferences.set({ key: 'turnoIniciado', value: 'true' });
        } else if (turnoIniciado.value === 'true') {
          body.id_ubicacion = await Preferences.get({ key: 'id_ubicacion' });
          await this.http
            .put(
              `https://osolices.pythonanywhere.com/ubicacionguardia/${body.id_ubicacion}/`,
              body
            )
            .toPromise();
          console.log(
            'Ubicación del guardia enviada (PUT):',
            latitud,
            longitud
          );
        }
      }
    } catch (error) {
      console.error('Error al enviar la ubicación del guardia:', error);
    }
  }

  async confirmarFinalizarTurno() {
    const result = await Swal.fire({
      title: 'Confirmación',
      text: '¿Estás seguro de que quieres finalizar el turno?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, finalizar',
      cancelButtonText: 'No, cancelar',
      heightAuto: false,
      confirmButtonColor: 'rgb(57, 88, 134)',
    });

    if (result.isConfirmed) {
      await this.finalizarTurno();
    }
  }
  async finalizarTurno() {
    interface AsistenciaResponse {
      id_asistencia: number;
      hora_ini_1: string;
      hora_fin_1: string | null;
      hora_ini_2: string | null;
      hora_fin_2: string | null;
      remuneracion_final: number | null;
      id_descuento: number;
      id_asignacion: number;
    }
    const { value } = await Preferences.get({ key: 'asistencia' });
    if (value !== null) {
      const asistencia = JSON.parse(value) as AsistenciaResponse;

      // Actualizar la hora de inicio de la colación
      const horaActual = new Date();
      const horas = horaActual.getHours().toString().padStart(2, '0');
      const minutos = horaActual.getMinutes().toString().padStart(2, '0');
      const horaFormateada = `${horas}:${minutos}`;
      asistencia.hora_fin_2 = horaFormateada;
      this.botonIncidenciaHabilitado = false;
      this.botonColacionHabilitado = false;
      this.cd.detectChanges();
      this.http
        .put(
          `https://osolices.pythonanywhere.com/asistencia/${asistencia.id_asistencia}/`,
          asistencia
        )
        .subscribe(
          async (response: any) => {
            // Agrega 'async' aquí
            const updatedAsistencia = response as AsistenciaResponse;
            console.log('Respuesta de la API:', updatedAsistencia);
            if (this.ubicacionGuardiaTask) {
              // Detener la tarea de seguimiento de ubicación del guardia al finalizar el turno
              clearInterval(this.ubicacionGuardiaTask);
              console.log(
                'Tarea de seguimiento de ubicación del guardia detenida.'
              );
            }
            this.stopCounter();
            this.toast('Turno Finalizado');
            // Eliminar todos los datos de Preferences
            await Preferences.clear(); 
            console.log('Todos los datos de Preferences han sido eliminados.');
            this.cd.detectChanges();
          },
          (error) => {
            console.error('Error al realizar la solicitud PUT:', error);
          }
        );
    } else {
      console.error('No se encontró la asistencia en el almacenamiento local');
    }
  }

  async confirmarIniColacion() {
    const result = await Swal.fire({
      title: 'Confirmación',
      text: '¿Estás seguro de que quieres iniciar tú colación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, iniciar',
      cancelButtonText: 'No, cancelar',
      heightAuto: false,
      confirmButtonColor: 'rgb(57, 88, 134)',
    });

    if (result.isConfirmed) {
      await this.marcarInicioColacion();
    }
  }
  async marcarInicioColacion() {
    interface AsistenciaResponse {
      id_asistencia: number;
      hora_ini_1: string;
      hora_fin_1: string | null;
      hora_ini_2: string | null;
      hora_fin_2: string | null;
      remuneracion_final: number | null;
      id_descuento: number;
      id_asignacion: number;
    }
    const { value } = await Preferences.get({ key: 'asistencia' });
    if (value !== null) {
      const asistencia = JSON.parse(value) as AsistenciaResponse;

      // Actualizar la hora de inicio de la colación
      const horaActual = new Date();
      const horas = horaActual.getHours().toString().padStart(2, '0');
      const minutos = horaActual.getMinutes().toString().padStart(2, '0');
      const horaFormateada = `${horas}:${minutos}`;
      asistencia.hora_fin_1 = horaFormateada;

      this.http
        .put(
          `https://osolices.pythonanywhere.com/asistencia/${asistencia.id_asistencia}/`,
          asistencia
        )
        .subscribe(
          (response: any) => {
            const updatedAsistencia = response as AsistenciaResponse;
            console.log('Respuesta de la API:', updatedAsistencia);
            this.toast('Colación Iniciada');
            // Guardar la asistencia actualizada en el almacenamiento local
            Preferences.set({
              key: 'asistencia',
              value: JSON.stringify(updatedAsistencia),
            });

            let ini_colacion = document.getElementById('ini_colacion');
            if (ini_colacion) {
              ini_colacion.style.display = 'none';
              Preferences.set({
                key: 'botonIniColacionVisible',
                value: 'none',
              });
            }
            let fin_colacion = document.getElementById('fin_colacion');
            if (fin_colacion) {
              fin_colacion.style.display = '';
              Preferences.set({
                key: 'botonFinColacionVisible',
                value: '',
              });
            }
            Preferences.set({
              key: 'botonColacionHabilitado',
              value: 'false',
            });

            this.botonColacionHabilitado = false;
            this.botonFinColacionHabilitado = true;
            this.cd.detectChanges();
          },
          (error) => {
            console.error('Error al realizar la solicitud PUT:', error);
          }
        );
    } else {
      console.error('No se encontró la asistencia en el almacenamiento local');
    }
  }
  async confirmarFinColacion() {
    const result = await Swal.fire({
      title: 'Confirmación',
      text: '¿Estás seguro de que quieres finalizar tú colación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, finalizar',
      cancelButtonText: 'No, cancelar',
      heightAuto: false,
      confirmButtonColor: 'rgb(57, 88, 134)',
    });

    if (result.isConfirmed) {
      await this.marcarFinColacion();
    }
  }
  async marcarFinColacion() {
    interface AsistenciaResponse {
      id_asistencia: number;
      hora_ini_1: string;
      hora_fin_1: string | null;
      hora_ini_2: string | null;
      hora_fin_2: string | null;
      remuneracion_final: number | null;
      id_descuento: number;
      id_asignacion: number;
    }
    const { value } = await Preferences.get({ key: 'asistencia' });
    if (value !== null) {
      const asistencia = JSON.parse(value) as AsistenciaResponse;

      // Actualizar la hora de inicio de la colación
      const horaActual = new Date();
      const horas = horaActual.getHours().toString().padStart(2, '0');
      const minutos = horaActual.getMinutes().toString().padStart(2, '0');
      const horaFormateada = `${horas}:${minutos}`;
      asistencia.hora_ini_2 = horaFormateada;

      this.http
        .put(
          `https://osolices.pythonanywhere.com/asistencia/${asistencia.id_asistencia}/`,
          asistencia
        )
        .subscribe(
          (response: any) => {
            const updatedAsistencia = response as AsistenciaResponse;
            console.log('Respuesta de la API:', updatedAsistencia);
            this.toast('Colación Finalizada');
            // Guardar la asistencia actualizada en el almacenamiento local
            Preferences.set({
              key: 'asistencia',
              value: JSON.stringify(updatedAsistencia),
            });

            this.botonFinColacionHabilitado = false;
            this.cd.detectChanges();
          },
          (error) => {
            console.error('Error al realizar la solicitud PUT:', error);
          }
        );
    } else {
      console.error('No se encontró la asistencia en el almacenamiento local');
    }
  }

  crearIncidencias() {
    this.http
      .get(`https://osolices.pythonanywhere.com/tipoincidencia/`)
      .subscribe((data: any) => {
        this.incidencias = data;
        console.log(this.incidencias);
      });
  }

  async enviarIncidencia() {
    console.log(this.tipoIncidenciaSelect.value);
    const tipoIncidencia = this.tipoIncidenciaSelect.value.id_tipo_incidencia;
    const descripcionIncidencia = this.tipoIncidenciaSelect.value.descripcion;
    const descripcion = this.descripcionTextarea.value;

    console.log(tipoIncidencia);
    console.log(descripcion);

    if (tipoIncidencia && descripcion) {
      let body: any; // Declara 'body' aquí

      interface AsistenciaResponse {
        id_asistencia: number;
        hora_ini_1: string;
        hora_fin_1: string | null;
        hora_ini_2: string | null;
        hora_fin_2: string | null;
        remuneracion_final: number | null;
        id_descuento: number;
        id_asignacion: number;
      }
      const { value } = await Preferences.get({ key: 'asistencia' });
      if (value !== null) {
        const asistencia = JSON.parse(value) as AsistenciaResponse;
        body = {
          // Asigna un valor a 'body' aquí
          detalle_incidencia: descripcion,
          id_tipo_incidencia: tipoIncidencia,
          id_asignacion: asistencia.id_asignacion.toString(),
        };
      }

      // Ahora puedes usar 'body' aquí
      this.http
        .post('https://osolices.pythonanywhere.com/incidencia/', body)
        .subscribe(
          (response) => {
            const email: OpenOptions = {
              to: ['danilosantelices@gmail.com'],
              subject: 'Reporte de incidencia',
              body: `Se ha reportado una incidencia de tipo "${descripcionIncidencia}" con la siguiente descripción: ${descripcion}. Adjunto imagen o video de evidencia:`,
              isHtml: true,
            };
            EmailComposer.open(email)
              .then(() => {
                console.log('Correo enviado exitosamente');
                this.modalController.dismiss();
                this.toast('Incidencia Reportada');
              })
              .catch((error) => {
                console.error('Error enviando el correo:', error);
              });
          },
          (error) => {
            console.error('Error subiendo los datos:', error);
          }
        );
    } else {
      console.error('Faltan datos para enviar la incidencia');
    }
  }
}
