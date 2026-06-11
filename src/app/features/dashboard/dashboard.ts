import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html'
})
export class DashboardComponent {
  stats = [
    { label: 'Órdenes Pendientes', value: '12', trend: 8, bgClass: 'bg-amber-100', iconClass: 'text-amber-600' },
    { label: 'En Diagnóstico', value: '5', trend: 2, bgClass: 'bg-blue-100', iconClass: 'text-blue-600' },
    { label: 'Reparados Hoy', value: '8', trend: 15, bgClass: 'bg-emerald-100', iconClass: 'text-emerald-600' },
    { label: 'Entregas del Mes', value: '45', trend: 5, bgClass: 'bg-indigo-100', iconClass: 'text-indigo-600' },
  ];
}
