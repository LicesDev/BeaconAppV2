import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../servicio/auth.service';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.page.html',
  styleUrls: ['./dash.page.scss'],
})
export class DashPage implements OnInit {
  asignaciones: any[] = [];


  constructor(private router: Router, private http: HttpClient,private authService: AuthService) {}

  getTurnosGuardia() {
    const userData = window.localStorage.getItem('userData');
    console.log(userData)
    if (userData) {
      const rut = JSON.parse(userData).rut_guarida;
      console.log(rut)
      this.http
        .get(`https://osolices.pythonanywhere.com/asignacionturno/`)
        .subscribe((dataAs: any) => {
          const asignacionesGuardia = dataAs.filter((dataAs: any) => dataAs.rut_guarida === rut);
          
          console.log('A:',asignacionesGuardia)

          asignacionesGuardia.forEach((asignacion: any) => {
            this.http
              .get(`https://osolices.pythonanywhere.com/turno/`)
              .subscribe((dataS: any) => {
                const asignacionGuardia = dataS.filter((dataS: any) => dataS.id_turno === asignacion.id_turno);
                console.log('B:', asignacionGuardia)         
                const id_turno = asignacionGuardia[0].id_turno;
                const id_sede = asignacionGuardia[0].id_sede; 
                const fecha = asignacionGuardia[0].fecha; 
                const hora_inicio = asignacionGuardia[0].horario_inicio; 
                const hora_fin = asignacionGuardia[0].hora_fin; 
                const remuneracion = asignacionGuardia[0].remuneracion; 

                asignacion.fecha = fecha;
                asignacion.hora_inicio = hora_inicio;
                asignacion.hora_fin = hora_fin;
                asignacion.remuneracion = remuneracion;
                console.log(id_turno)
                console.log(id_sede)
                if (id_turno) {
                  this.http
                    .get(
                      `https://osolices.pythonanywhere.com/sede/`
                      )
                      .subscribe((sedeData: any) => {
                        console.log(sedeData)
                        const sede = sedeData.filter((sedeData: any) => sedeData.id_sede === id_sede);
                        const nombre = sede[0].nombre;
                        const direccion = sede[0].direccion; // Aquí está la corrección
                        const foto = sede[0].foto; // Aquí está la corrección

                        console.log( nombre);
                        console.log( direccion);
                        console.log(foto);
                        asignacion.nombre = nombre;
                        asignacion.direccion = direccion;
                        asignacion.foto = foto;
                        this.asignaciones.push(asignacion);
                      });
                  
                }
              });
          });
        }); 
    }
}


  
  logOut() {
    this.authService.logout(); // Llama al método logout de AuthServiceService aquí
    this.router.navigate(['/login']);
  }
 

  ngOnInit() {
    let element = document.getElementById('navbarToggleExternalContent');
    if (element) {
      let bsCollapse = new bootstrap.Collapse(element, {
        toggle: false,
      });
    }
    this.getTurnosGuardia();
  }

  navegar(asignacion:any) {
    let queryParams = {
      id_asignacion: asignacion.id_asignacion,
      rut_guarida: asignacion.rut_guarida,
      id_turno: asignacion.id_turno,
      fecha: asignacion.fecha,
      hora_inicio: asignacion.hora_inicio,
      hora_fin: asignacion.hora_fin,
      remuneracion: asignacion.remuneracion,
      nombre: asignacion.nombre,
      direccion: asignacion.direccion,
      foto: asignacion.foto
    };
  
    this.router.navigate(['/asistencia'], { queryParams });
  }
  
}
