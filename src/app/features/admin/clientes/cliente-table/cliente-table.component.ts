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
import { Cliente } from '../../../../core/models/cliente.model';

@Component({
  selector: 'app-cliente-table',
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
  templateUrl: './cliente-table.html',
})
export class ClienteTableComponent {
  @Input() clientes: Cliente[] = [];
  @Input() loading = false;

  @Output() edit = new EventEmitter<Cliente>();
  @Output() delete = new EventEmitter<Cliente>();

  readonly Search = Search;

  onEdit(cliente: Cliente) {
    this.edit.emit(cliente);
  }

  onDelete(cliente: Cliente) {
    this.delete.emit(cliente);
  }
}
