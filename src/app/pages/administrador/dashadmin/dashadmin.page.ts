import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../servicio/auth.service';
@Component({
  selector: 'app-dashadmin',
  templateUrl: './dashadmin.page.html',
  styleUrls: ['./dashadmin.page.scss'],
})
export class DashadminPage implements OnInit {
  asignaciones: any[] = [];


  constructor(private router: Router, private http: HttpClient,private authService: AuthService) {}

  getTurnosGuardia() {
    const userData = window.localStorage.getItem('userData');
    console.log(userData);
    if (userData) {
      this.http.get(`https://osolices.pythonanywhere.com/turno/`).subscribe((dataS: any) => {
        const fechaActual = new Date().toLocaleDateString('en-CA', {timeZone: 'America/Santiago'});
        console.log(fechaActual);
        console.log(dataS);
        const turnos = dataS.filter((dataS: any) => dataS.fecha === fechaActual);
        console.log(turnos);
  
        turnos.forEach((turno: any) => {
          this.http.get(`https://osolices.pythonanywhere.com/sede/`).subscribe((sedeData: any) => {
            console.log(sedeData);
            const sede = sedeData.filter((sedeData: any) => sedeData.id_sede === turno.id_sede);
            const nombre = sede[0].nombre;
            const direccion = sede[0].direccion;
            const foto = sede[0].foto;
  
            console.log(nombre);
            console.log(direccion);
            console.log(foto);
  
            turno.nombre = nombre;
            turno.direccion = direccion;
            turno.foto = foto;
  
            this.asignaciones.push(turno);
          });
        });
  
        console.log(this.asignaciones);
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
      hora_inicio: asignacion.horario_inicio,
      hora_fin: asignacion.hora_fin,
      remuneracion: asignacion.remuneracion,
      nombre: asignacion.nombre,
      direccion: asignacion.direccion,
      foto: asignacion.foto,
      ctd_guardias: asignacion.ctd_guardias
    };
  
    this.router.navigate(['/turno-activo'], { queryParams });
  }
  
}
