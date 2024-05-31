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

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage implements OnInit, AfterViewInit, OnDestroy {
  usuario: any = {};
  asistencia: any[] = [];
  asignacion: any;
  lat?: number;
  lng?: number;
  timestamp?: number;
  botonTurnoHabilitado = false;
  botonColacionHabilitado = false;
  botonPermanenciaHabilitado = false;
  botonIncidenciaHabilitado = false;
  botonFinColacionHabilitado = false;
  tiempoRestante = 2 * 60 * 60;
  intervalId: any;
  ubicacionGuardiaTask: any;
  ubicacionGuardiaTaskInterval = 10 * 60 * 1000;

  constructor(
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.asignacion = params;
    });
    await this.obtenerUbicacionGuardia();

    // Recuperar el estado del contador del almacenamiento local solo cuando se inicializa el componente
    const { value } = await Preferences.get({ key: 'tiempoRestante' });
    this.tiempoRestante = value ? Number(value) : 2 * 60 * 60;

    // Configurar el listener de estado de la aplicación
    App.addListener('appStateChange', async ({ isActive }) => {
      if (isActive) {
        // Recuperar el estado de los botones del almacenamiento local
        const { value: botonComenzarVisible } = await Preferences.get({
          key: 'botonComenzarVisible',
        });
        const { value: botonFinalizarVisible } = await Preferences.get({
          key: 'botonFinalizarVisible',
        });
        let comenzar = document.getElementById('asistencia');
        let finalizar = document.getElementById('finalizar');
        if (comenzar) {
          comenzar.style.display =
            botonComenzarVisible === 'none' ? 'none' : '';
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
          ini_colacion.style.display = botonIniColacionVisible === 'none' ? 'none' : '';
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
      } else {
        // Guardar el estado del contador en el almacenamiento local cuando la aplicación se minimiza o cierra
        await Preferences.set({
          key: 'tiempoRestante',
          value: this.tiempoRestante.toString(),
        });
        this.stopCounter();
      }
    });
  }

  async ngAfterViewInit() {
    this.startCounter();
    this.detectDevice();
    // Recuperar el estado de los botones del almacenamiento local
    const { value: botonComenzarVisible } = await Preferences.get({
      key: 'botonComenzarVisible',
    });
    const { value: botonFinalizarVisible } = await Preferences.get({
      key: 'botonFinalizarVisible',
    });
    let comenzar = document.getElementById('asistencia');
    let finalizar = document.getElementById('finalizar');
    if (comenzar) {
      comenzar.style.display = botonComenzarVisible === 'none' ? 'none' : '';
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
      ini_colacion.style.display = botonIniColacionVisible === 'none' ? 'none' : '';
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
    // Reiniciar el contador
    this.startCounter();
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
  startCounter() {
    // Asegurarse de que no hay otros intervalos ejecutándose antes de crear uno nuevo
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(async () => {
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
      }
    }, 1000);
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

      await BleClient.requestLEScan(
        { name: targetDeviceName },
        (scanResult) => {
          if (scanResult.device.name === targetDeviceName) {
            console.log('BALIZA OBJETIVO ENCONTRADA:', scanResult.device);
            this.botonTurnoHabilitado = true;
          }
        }
      );

      setTimeout(() => {
        BleClient.stopLEScan();
      }, 5000);
    } catch (error) {
      console.error('Error al inicializar el Bluetooth:', error);
    }
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

      this.permanencia();
      this.startCounter();
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
      // Obtener la hora actual y formatearla como "HH:MM"
      const horaActual = new Date();
      const horas = horaActual.getHours().toString().padStart(2, '0');
      const minutos = horaActual.getMinutes().toString().padStart(2, '0');
      const horaFormateada = `${horas}:${minutos}`;

      // Obtener id_asignacion
      const idAsignacion = this.asignacion?.id_asignacion;
      const remuneracion = this.asignacion?.remuneracion;
      // Construir el cuerpo de la solicitud
      const body = {
        hora_ini_1: horaFormateada,
        hora_fin_1: null,
        hora_ini_2: null,
        hora_fin_2: null,
        remuneracion_final: remuneracion,
        id_descuento: 1,
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
    const taskId = await BackgroundTask.beforeExit(async () => {
      await Preferences.set({
        key: 'tiempoRestante',
        value: this.tiempoRestante.toString(),
      });

      BackgroundTask.finish({ taskId });
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

  goToDash() {
    setTimeout(() => {
      this.router.navigate(['/dashboard-alumnos']);
    }, 3000);
  }

  registrarAsistencia() {
    if (this.asistencia.length > 0) {
      const rut = this.asistencia[0].rut;
      const clase = this.asistencia[0].id_clase;
      const fecha = this.asistencia[0].fecha;
      const estado = 'Presente';

      const body = {
        rut_alumno: `https://osolices.pythonanywhere.com/alumnos/${rut}/`,
        id_clase: `https://osolices.pythonanywhere.com/clases/${clase}/`,
        fecha: fecha,
        estado: estado,
      };

      console.log(body);

      this.http
        .post('https://osolices.pythonanywhere.com/asistencias/', body)
        .subscribe(
          (response) => {
            console.log(response);
            this.presente('¡Estás Presente!');
          },
          (error) => {
            console.error(error);
            this.presente('Ya estás presente');
          }
        );
    } else {
      console.log('El array asistencia está vacío');
    }
  }

  presente(mensaje: string) {
    const toast = document.createElement('ion-toast');
    toast.message = mensaje;
    toast.duration = 2000;

    document.body.appendChild(toast);
    return toast.present();
  }

  datosUsuario() {
    const userData = window.localStorage.getItem('userData');
    if (userData) {
      this.usuario.rut = JSON.parse(userData).rut_alumno;
      this.usuario.nombre = JSON.parse(userData).nombre;
      this.usuario.apellido = JSON.parse(userData).apellido;
    }
  }

  finalizar() {
    this.router.navigate(['/dashboard-alumno']);
  }

  async iniciarSeguimientoUbicacionGuardia() {
    this.ubicacionGuardiaTask = setInterval(async () => {
      try {
        // Obtener la ubicación actual del guardia
        const coordinates = await Geolocation.getCurrentPosition();
        const latitud = coordinates.coords.latitude;
        const longitud = coordinates.coords.longitude;
        const timestamp = coordinates.timestamp;

        // Enviar la ubicación del guardia al servidor
        await this.enviarUbicacionGuardia(latitud, longitud, timestamp);
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

  async enviarUbicacionGuardia(
    latitud: number,
    longitud: number,
    timestamp: number
  ) {
    try {
      const body = {
        latitud: latitud,
        longitud: longitud,
        timestamp: timestamp,
      };

      await this.http
        .post('https://osolices.pythonanywhere.com/ubicacion_guardia/', body)
        .toPromise();
      console.log('Ubicación del guardia enviada:', latitud, longitud);
    } catch (error) {
      console.error('Error al enviar la ubicación del guardia:', error);
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

      this.http
      .put(
        `https://osolices.pythonanywhere.com/asistencia/${asistencia.id_asistencia}/`,
        asistencia
      )
      .subscribe(
        async (response: any) => { // Agrega 'async' aquí
          const updatedAsistencia = response as AsistenciaResponse;
          console.log('Respuesta de la API:', updatedAsistencia);
          if (this.ubicacionGuardiaTask) {
            // Detener la tarea de seguimiento de ubicación del guardia al finalizar el turno
            clearInterval(this.ubicacionGuardiaTask);
            console.log('Tarea de seguimiento de ubicación del guardia detenida.');
          }
          this.stopCounter();
      
          // Eliminar todos los datos de Preferences
          await Preferences.clear(); // Ahora puedes usar 'await' aquí
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
            this.botonFinColacionHabilitado =true;
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

            // Guardar la asistencia actualizada en el almacenamiento local
            Preferences.set({
              key: 'asistencia',
              value: JSON.stringify(updatedAsistencia),
            });
            
            this.botonFinColacionHabilitado =true;
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
}
