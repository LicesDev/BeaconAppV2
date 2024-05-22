import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Geolocation } from '@capacitor/geolocation';
import { BleClient, ScanResult } from '@capacitor-community/bluetooth-le';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage implements OnInit {

  usuario: any={};

  asistencia: any[] = [];

  asignacion: any;

  lat?: number;
  lng?: number;
  timestamp?: number;

  bluetoothScanResults: ScanResult[] = [];
  bluetoothIsScanning = false;

  bluetoothConnectedDevice?: ScanResult;

  constructor(private router: Router, private http: HttpClient, private route: ActivatedRoute) {}
  

  goToDash() {
    setTimeout(() => {
      this.router.navigate(['/dashboard-alumnos']);
    }, 3000);
  }

  registrarAsistencia(){
    if (this.asistencia.length > 0) {
      const rut = this.asistencia[0].rut;
      const clase = this.asistencia[0].id_clase;
      const fecha= this.asistencia[0].fecha;
      const estado= 'Presente';

      const body = {
        rut_alumno: `https://osolices.pythonanywhere.com/alumnos/${rut}/`,
        id_clase: `https://osolices.pythonanywhere.com/clases/${clase}/`,
        fecha: fecha,
        estado: estado
      };

      console.log(body);

      this.http
        .post('https://osolices.pythonanywhere.com/asistencias/', body)
        .subscribe(response => {
          console.log(response);
          this.presente('!Estás Presente¡');
        }, error => {
          console.error(error);
          this.presente('Ya estas presente');
        });
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

  datosUsuario(){
    const userData = window.localStorage.getItem('userData');
    if (userData) {
      this.usuario.rut = JSON.parse(userData).rut_alumno;
      this.usuario.nombre = JSON.parse(userData).nombre;
      this.usuario.apellido = JSON.parse(userData).apellido;
    }
  }
  async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.asignacion = params;
    });
    const options: PositionOptions = {
      enableHighAccuracy: true,
      maximumAge: 0, 
      timeout: 10000
    };
    const coordinates = await Geolocation.getCurrentPosition(options);
    console.log('Current position:', coordinates);

    this.lat = coordinates.coords.latitude;
    this.lng = coordinates.coords.longitude;
    console.log(this.lat)
    console.log(this.lng)
    this.timestamp = coordinates.timestamp;
    console.log('QRPage lat, lng:', this.lat, this.lng);

    
  }
  

  finalizar(){
    this.router.navigate([`/dashboard-alumno`]);
  }

  async ngAfterViewInit(){
    await this.detectDevice();
    await this.scanForBluetoothDevices();
  }

  async detectDevice() {

    try {
      console.log('INICIALIZANDO BLUETOOTH');
      await BleClient.initialize();

      console.log('VERIFICANDO ESTADO DEL BLUETOOTH');
      const isEnabled = await BleClient.isEnabled();
      if (!isEnabled) {
          console.log('BLUETOOTH NO ESTÁ ACTIVADO');
          // En Android, puedes solicitar al usuario que active el Bluetooth
          if (BleClient.requestEnable) {
              await BleClient.requestEnable();
          }
          return;
      }

      console.log('ESCANEANDO');
      // El nombre de tu baliza
      const targetDeviceName = 'Sede Test';

      // Comienza a escanear dispositivos
      await BleClient.requestLEScan(
          { name: targetDeviceName },
          (scanResult) => {
              if (scanResult.device.name === targetDeviceName) {
                  console.log('BALIZA OBJETIVO ENCONTRADA:', scanResult.device);
              }
          }
          
      );

      // Detén el escaneo después de un tiempo determinado
      setTimeout(() => {
          BleClient.stopLEScan();
      }, 5000);
  } catch (error) {
    console.error('Error al inicializar el Bluetooth:', error);
}
}

async scanForBluetoothDevices() {
  try {
    await BleClient.initialize();

    this.bluetoothScanResults = [];
    this.bluetoothIsScanning = true;

    await BleClient.requestLEScan(
      { services: [] },
      this.onBluetoothDeviceFound.bind(this)
    );

    const stopScanAfterMilliSeconds = 3500;
    setTimeout(async () => {
      await BleClient.stopLEScan();
      this.bluetoothIsScanning = false;
      console.log('stopped scanning');
    }, stopScanAfterMilliSeconds);
  } catch (error) {
    this.bluetoothIsScanning = false;
    console.error('scanForBluetoothDevices', error);
  }
}

onBluetoothDeviceFound(result: ScanResult) {
  console.log('received new scan result', result);
  this.bluetoothScanResults.push(result);
}
  
}

