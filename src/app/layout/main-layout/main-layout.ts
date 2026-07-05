import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  LucideAngularModule,
  LayoutDashboard,
  ClipboardList,
  Users,
  HardDrive,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-angular';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './main-layout.html',
  styleUrls: [],
})
export class MainLayoutComponent {
  isSidebarOpen = true;

  readonly LayoutDashboard = LayoutDashboard;
  readonly ClipboardList = ClipboardList;
  readonly Users = Users;
  readonly HardDrive = HardDrive;
  readonly Settings = Settings;
  readonly LogOut = LogOut;
  readonly Menu = Menu;
  readonly X = X;

  menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Órdenes', icon: ClipboardList, path: '/orders' },
    { label: 'Clientes', icon: Users, path: '/admin/clientes' },
    { label: 'Equipos', icon: HardDrive, path: '/equipment' },
    { label: 'Ciudades', icon: Settings, path: '/admin/ciudades' },
    { label: 'Tipos Equipos', icon: Settings, path: '/admin/tipos' },
  ];

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
