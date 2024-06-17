import { catchError } from 'rxjs/operators';

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../servicio/auth.service';
import { ModalController, Platform } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import * as moment from 'moment-timezone';
import { File } from '@awesome-cordova-plugins/file';
import { FileOpener } from '@awesome-cordova-plugins/file-opener';

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.page.html',
  styleUrls: ['./reportes.page.scss'],
})
export class ReportesPage implements OnInit {
  logo: any;
  filas: any[] = [];
  asistencias: any[] = [];
  currentValue = new Date().toISOString();
  currentValueSede = 0;
  currentNombreSede = 'Todos';
  showModal = false;
  showModalSede = false;
  @ViewChild('modal') modal: any;
  @ViewChild('modalSede') modalSede: any;
  guardias: any[] = [];
  pdfObj:any;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private modalController: ModalController,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.getasistencias();
  }

  getasistencias() {
    this.http
      .get(`https://osolices.pythonanywhere.com/asistencia/`)
      .subscribe((asistencias: any) => {
        console.log(asistencias)
        asistencias.forEach((asis: any) => {
          this.http
            .get(
              `https://osolices.pythonanywhere.com/asignacionturno/${asis.id_asignacion}/`
            )
            .subscribe((asignacion: any) => {
              console.log(asignacion);
              this.http
                .get(
                  `https://osolices.pythonanywhere.com/turno/${asignacion.id_turno}/`
                )
                .subscribe((turno: any) => {
                  console.log(turno);
                  const fecha_seleccionada = this.currentValue
                    .toString()
                    .split('T')[0];
                  const fechaSeleSplit = fecha_seleccionada.split('-');
                  const yearCurrent = fechaSeleSplit[0];
                  const monthCurrent = fechaSeleSplit[1];
                  const fecha = turno.fecha;
                  const fechaSplit = fecha.split('-');
                  const year = fechaSplit[0];
                  const month = fechaSplit[1];
                  console.log(year + '-' + month);
                  console.log(yearCurrent + '-' + monthCurrent);
                  if (year + '-' + month === yearCurrent + '-' + monthCurrent) {
                    this.http
                      .get(
                        `https://osolices.pythonanywhere.com/sede/${turno.id_sede}/`
                      )
                      .subscribe((sede: any) => {
                        console.log(sede);
                        this.http
                          .get(
                            `https://osolices.pythonanywhere.com/guardia/${asignacion.rut_guarida}/`
                          )
                          .subscribe((guardia: any) => {
                            console.log(guardia);

                            asis.id_turno = asignacion.id_turno;
                            asis.guardia =
                            guardia.p_nombre + ' ' + guardia.p_apellido;
                            asis.fecha = turno.fecha;
                            asis.id_sede = sede.id_sede;
                            asis.sede = sede.nombre;
                            asis.direccion = sede.direccion;
                            console.log(asis.id_sede);
                            console.log(this.currentValueSede);
                            console.log(asis.remuneracion_inicial)
                            console.log(asis.remuneracion_final)
                            if (asis.remuneracion_inicial !== null && asis.remuneracion_inicial > asis.remuneracion_final) {
                              this.asistencias.push(asis);

                            }
                            this.asistencias.sort(
                              (a, b) => b.id_asisdencia - a.id_asisdencia
                            );
                            console.log(this.asistencias);
                          });
                      });
                  }
                });
            });
        });
      });
  }

  getSedes() {
    this.http
      .get(`https://osolices.pythonanywhere.com/guardia/`)
      .subscribe((guardia: any) => {
        console.log(guardia);

        this.guardias.push(...guardia);
      });
  }

  getNombreSede(rut_guarida:any){
    this.http
      .get(`https://osolices.pythonanywhere.com/guardia/${rut_guarida}/`)
      .subscribe((sede: any) => {
        console.log(sede);

        this.currentNombreSede= sede.nombre;
      });
  }

  openModalFecha() {
    this.showModal = true;
  }

  openModalSede() {
    this.getSedes();
    this.showModalSede = true;
  }

  onDidDismissFecha(event: CustomEvent) {
    console.log('Fecha seleccionada:', this.currentValue);
    this.showModal = false;
  }

  onDidDismissSede(event: CustomEvent) {
    console.log('Sede seleccionada:', this.currentValueSede);
    this.showModalSede = false;
  }

  onIonChange(event: CustomEvent) {
    this.currentValue = event.detail.value;
    this.asistencias = [];
    this.getasistencias();
  }

  onSedeChange(event: CustomEvent) {
    this.currentValueSede = event.detail.value;
    this.getNombreSede(this.currentValueSede);
    this.asistencias = [];
    this.getasistencias();
  }

  toast(mensaje: string) {
    const toast = document.createElement('ion-toast');
    toast.message = mensaje;
    toast.duration = 2000;
    toast.cssClass = 'my-toast'; // Añade esta línea

    document.body.appendChild(toast);
    return toast.present();
  }
  async confirmarCrear() {
    const result = await Swal.fire({
      title: 'Confirmación',
      text: '¿Estás seguro desea generar este informe?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, generar',
      cancelButtonText: 'No, cancelar',
      heightAuto: false,
      confirmButtonColor: 'rgb(57, 88, 134)',
    });

    if (result.isConfirmed) {
      this.createPDF();
    }
  }
  
  async createPDF() {
    try {
      const docDefinition = await this.getPdfDefinition(); // Asegúrate de esperar la definición del documento
      this.pdfObj = pdfMake.createPdf(docDefinition);
      await this.downloadPdf(); // Espera a que se complete la descarga
    } catch (error) {
      console.error('Error creating PDF', error);
    }
  }

  async downloadPdf() {
    const fecha = moment().tz('America/Santiago').format();
    const fecha2 = fecha.toString().split('T')[0]; 
    const hora=  fecha.toString().split('T')[1]; 
    const hora1= hora.toString().split(':')[0];
    const hora2= hora.toString().split(':')[1];  
    const fileName = 'reporte_atrasos_' + fecha2 +'_'+hora1+'-'+hora2+'.pdf';
    if (this.platform.is('cordova')) {
      this.pdfObj.getBuffer(async (buffer: any) => {
        const blob = new Blob([buffer], { type: 'application/pdf' });
        const filePath = File.dataDirectory + fileName;
  
        try {
          await File.writeFile(File.dataDirectory, fileName, blob, { replace: true });
          console.log('File written:', filePath); // Esto te mostrará la ruta exacta del archivo guardado
          await FileOpener.open(filePath, 'application/pdf');
        } catch (err) {
          console.error('Error writing file', err);
        }
      });
    } else {
      this.pdfObj.download(fileName); // Asegúrate de pasar el nombre del archivo aquí también
    }
  }


  getPdfDefinition(){
    const fecha = moment().tz('America/Santiago').format();
    const fecha2 = fecha.toString().split('T')[0]; 
    const hora=  fecha.toString().split('T')[1]; 
    const hora1= hora.toString().split(':')[0];
    const hora2= hora.toString().split(':')[1];  
    const asistencias = this.asistencias;
    this.filas = []; // Asegúrate de inicializar this.filas como un arreglo vacío
  
  asistencias.forEach(asisdencia => {
    // Suponiendo que 'asisdencia' es un objeto con las propiedades que quieres mostrar
    const fila = [
      asisdencia.id_asistencia, 
      asisdencia.guardia,
      asisdencia.sede, 
      asisdencia.direccion, 
      asisdencia.fecha, 
      asisdencia.remuneracion_inicial,
      asisdencia.remuneracion_final,
      asisdencia.porc_descuento
    ];
    this.filas.push(fila); // Agrega cada 'fila' al arreglo 'this.filas'
  });
  // Uso de la función
 
  const body= [
      ['ID', 'Guardia', 'Sede', 'Direccion', 'Fecha', 'Remuneracion Inicial', 'Remuneracion Final', 'Descuento %'],
      ...this.filas      
    ]
  console.log(body)
    var dd = {
      content: [
        {
          text: 'Reporte Atrasos',
          style: 'header'
        },
        {
          text: 'Generado el ' +fecha2+ ' a las ' +hora1+':'+hora2,
          style: 'subheader'
        },
        {
          style: 'tableExample',
          table: {
            body: body, 
          }, 
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true
        },
        subheader: {
          fontSize: 15,
          bold: true
        },
        quote: {
          italics: true
        },
        tableExample: {
          margin: 5
        },
       
      }

    }
    return dd;
  }
  
}
