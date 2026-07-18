import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { LucideAngularModule, Search } from 'lucide-angular';
import { Equipo } from '../../../core/models/equipo.model';

@Component({
  selector: 'app-equipo-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TooltipModule,
    TagModule,
    LucideAngularModule,
  ],
  templateUrl: './equipo-table.html',
})
export class EquipoTableComponent {
  @Input() equipos: Equipo[] = [];
  @Input() loading = false;

  @Output() edit = new EventEmitter<Equipo>();
  @Output() delete = new EventEmitter<Equipo>();

  readonly Search = Search;

  onEdit(equipo: Equipo) {
    this.edit.emit(equipo);
  }

  onDelete(equipo: Equipo) {
    this.delete.emit(equipo);
  }
}
