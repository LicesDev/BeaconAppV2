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
  selector: 'app-gestionar-incidencias',
  templateUrl: './gestionar-incidencias.page.html',
  styleUrls: ['./gestionar-incidencias.page.scss'],
})
export class GestionarIncidenciasPage implements OnInit {
  incidencias: any[] = [];
  currentValue = new Date().toISOString();
  currentValueSede = 0;
  currentNombreSede = 'Todas';
  showModal = false;
  showModalSede = false;
  @ViewChild('modal') modal: any;
  @ViewChild('modalSede') modalSede: any;
  sedes: any[] = [];
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
    this.getIncidencias();
  }

  getIncidencias() {
    this.http
      .get(`https://osolices.pythonanywhere.com/incidencia/`)
      .subscribe((incidencias: any) => {
        incidencias.forEach((inci: any) => {
          this.http
            .get(
              `https://osolices.pythonanywhere.com/asignacionturno/${inci.id_asignacion}/`
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

                            inci.id_turno = asignacion.id_turno;
                            inci.guardia =
                              guardia.p_nombre + ' ' + guardia.p_apellido;
                            inci.fecha = turno.fecha;
                            inci.id_sede = sede.id_sede;
                            inci.sede = sede.nombre;
                            inci.direccion = sede.direccion;
                            console.log(inci.id_sede);
                            console.log(this.currentValueSede);
                            const existeIncidencia = this.incidencias.some(
                              (inc) => inc.id_incidencia === inci.id_incidencia
                            );

                            // Si no existe y cumple con la condición, entonces agrega la incidencia
                            if (
                              !existeIncidencia &&
                              (this.currentValueSede === 0 ||
                                inci.id_sede == this.currentValueSede)
                            ) {
                              this.incidencias.push(inci);
                              this.incidencias.sort(
                                (a, b) => b.id_incidencia - a.id_incidencia
                              );
                            }

                            console.log(this.incidencias);
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
      .get(`https://osolices.pythonanywhere.com/sede/`)
      .subscribe((sede: any) => {
        console.log(sede);

        this.sedes.push(...sede);
      });
  }

  getNombreSede(id_sede:any){
    this.http
      .get(`https://osolices.pythonanywhere.com/sede/${id_sede}/`)
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
    this.incidencias = [];
    this.getIncidencias();
  }

  onSedeChange(event: CustomEvent) {
    this.currentValueSede = event.detail.value;
    this.getNombreSede(this.currentValueSede);
    this.incidencias = [];
    this.getIncidencias();
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
  generatePDF(incidencias: any[]) {
    const doc = new jsPDF();
  
    // Asegúrate de tener el logo como una cadena base64 o un URL
    const logo = '../../../assets/img/Logo2.png'; // Reemplaza esto con tu imagen codificada en base64
  
    // Define las columnas y sus títulos
    const columns = [
      { header: 'ID', dataKey: 'id_incidencia' },
      { header: 'Sede', dataKey: 'sede' },
      { header: 'Direccion', dataKey: 'direccion' },
      { header: 'Fecha', dataKey: 'fecha' },
      { header: 'Guardia', dataKey: 'guardia' },
      { header: 'Detalle', dataKey: 'detalle_incidencia' },
      // Agrega más columnas según necesites
    ];
  
    const fecha = moment().tz('America/Santiago').format();
    const fecha2 = fecha.toString().split('T')[0]; 
    const hora=  fecha.toString().split('T')[1]; 
  const hora1= hora.toString().split(':')[0];
  const hora2= hora.toString().split(':')[1];  
    // Genera la tabla con los datos de incidencias
    autoTable(doc, {
      startY: 40, // Ajusta este valor según sea necesario para bajar la tabla
      columns: columns,
      body: incidencias,
      didDrawPage: (data) => {
        // Agrega el título y el logo
        doc.addImage(logo, 'PNG', 15, 10, 20, 20); // Ajusta las coordenadas y el tamaño según sea necesario
        doc.text('Reporte de Incidencias', 40, 15); // Ajusta las coordenadas según sea necesario
  
        // Cambia el tamaño de la fuente para el texto "Generado el:"
        doc.setFontSize(10); // Cambia el tamaño de la fuente a uno más pequeño
        doc.text('Generado el ' + fecha2 + ' a las '+hora1+':'+hora2, 40, 25); // Coloca este texto debajo del título
      },
    });
  
    // Restablece el tamaño de la fuente para el resto del documento si es necesario
    doc.setFontSize(12);
  
    // Guarda el PDF generado
    doc.save(`reporte-incidencias-${fecha}.pdf`);
  }
  
  createPDF() {
    try {
      const docDefinition = this.getPdfDefinition();
      this.pdfObj = pdfMake.createPdf(docDefinition);
      this.downloadPdf();
    } catch (error) {
      console.error('Error creating PDF', error);
    }
  }

  async downloadPdf() {
    if (this.platform.is('cordova')) {
      this.pdfObj.getBuffer((buffer: any) => {
        const blob = new Blob([buffer], { type: 'application/pdf' });
        const fileName = 'reporte_incidencia.pdf';

        File.writeFile(File.dataDirectory, fileName, blob, { replace: true })
          .then(fileEntry => {
            FileOpener.open(File.dataDirectory + fileName, 'application/pdf');
          })
          .catch(err => {
            console.error('Error writing file', err);
          });
      });
    } else {
      this.pdfObj.download();
    }
  }

  getPdfDefinition(){

    var dd = {
      content: [
        {
          text: 'This is a header, using header style',
          style: 'header'
        },
        'Lociunt triari naturam.\n\n',
        {
          text: 'Subheader 1 - using subheader style',
          style: 'subheader'
        },
        'Lorem',
        {
          text: 'Subheader 2 - using subheader style',
          style: 'subheader'
        },
      
        'ideo.\n\n',
        {
          text: 'p  the same properties',
          style: ['quote', 'small']
        }
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
        small: {
          fontSize: 8
        }
      }

    }
    return dd;
  }
  
}
