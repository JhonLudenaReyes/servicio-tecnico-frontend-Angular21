import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { LucideAngularModule, Search } from 'lucide-angular';
import { Ciudad } from '../../../core/models/ciudad.model';

@Component({
  selector: 'app-ciudad-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TooltipModule,
    LucideAngularModule,
  ],
  templateUrl: './ciudad-table.html',
})
export class CiudadTableComponent {
  @Input() ciudades: Ciudad[] = [];
  @Input() loading = false;

  @Output() edit = new EventEmitter<Ciudad>();
  @Output() delete = new EventEmitter<Ciudad>();

  readonly Search = Search;

  onEdit(ciudad: Ciudad) {
    this.edit.emit(ciudad);
  }

  onDelete(ciudad: Ciudad) {
    this.delete.emit(ciudad);
  }
}
