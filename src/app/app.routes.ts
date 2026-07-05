import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then((m) => m.DashboardComponent),
      },
      {
        path: 'admin/clientes',
        loadComponent: () =>
          import('./features/admin/clientes/clientes').then((m) => m.ClientesComponent),
      },
      {
        path: 'equipment',
        loadComponent: () => import('./features/equipment/equipos').then((m) => m.EquiposComponent),
      },
      {
        path: 'admin/ciudades',
        loadComponent: () =>
          import('./features/admin/ciudades/ciudades').then((m) => m.CiudadesComponent),
      },
      {
        path: 'admin/tipos',
        loadComponent: () => import('./features/admin/tipos/tipos').then((m) => m.TiposComponent),
      },
      {
        path: 'admin',
        redirectTo: 'admin/ciudades',
        pathMatch: 'full',
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
