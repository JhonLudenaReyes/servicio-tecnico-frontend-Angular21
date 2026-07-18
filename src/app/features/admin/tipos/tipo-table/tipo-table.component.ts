import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { LucideAngularModule, Search } from 'lucide-angular';
import { Tipo } from '../../../../core/models/tipo.model';

@Component({
  selector: 'app-tipo-table',
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
  templateUrl: './tipo-table.html',
})
export class TipoTableComponent {
  @Input() tipos: Tipo[] = [];
  @Input() loading = false;

  @Output() edit = new EventEmitter<Tipo>();
  @Output() delete = new EventEmitter<Tipo>();

  readonly Search = Search;

  onEdit(tipo: Tipo) {
    this.edit.emit(tipo);
  }

  onDelete(tipo: Tipo) {
    this.delete.emit(tipo);
  }
}
