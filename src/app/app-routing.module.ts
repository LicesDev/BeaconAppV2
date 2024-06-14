import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },
  {
    path: 'dashguard',
    loadChildren: () => import('./pages/guardia/dashguard/dash.module').then( m => m.DashPageModule)
  },
  {
    path: 'asistencia',
    loadChildren: () => import('./pages/guardia/asistencia/asistencia.module').then( m => m.AsistenciaPageModule)
  },
  {
    path: 'splash',
    loadChildren: () => import('./pages/splash/splash.module').then( m => m.SplashPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'mis-turnos',
    loadChildren: () => import('./pages/guardia/mis-turnos/mis-turnos.module').then( m => m.MisTurnosPageModule)
  },
  {
    path: 'tomar-turnos',
    loadChildren: () => import('./pages/guardia/tomar-turnos/tomar-turnos.module').then( m => m.TomarTurnosPageModule)
  },
  {
    path: 'solicitudes',
    loadChildren: () => import('./pages/guardia/solicitudes/solicitudes.module').then( m => m.SolicitudesPageModule)
  },
  {
    path: 'remuneraciones',
    loadChildren: () => import('./pages/guardia/remuneraciones/remuneraciones.module').then( m => m.RemuneracionesPageModule)
  },
  {
    path: 'dashadmin',
    loadChildren: () => import('./pages/administrador/dashadmin/dashadmin.module').then( m => m.DashadminPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
