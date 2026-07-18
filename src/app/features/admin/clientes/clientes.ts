import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

import { ClienteService } from '../../../core/services/cliente.service';
import { CiudadService } from '../../../core/services/ciudad.service';
import { Cliente } from '../../../core/models/cliente.model';
import { Ciudad } from '../../../core/models/ciudad.model';
import { ClienteTableComponent } from './cliente-table/cliente-table.component';
import { ClienteDialogComponent } from './cliente-dialog/cliente-dialog.component';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ClienteTableComponent,
    ClienteDialogComponent,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './clientes.html',
})
export class ClientesComponent implements OnInit {
  private clienteService = inject(ClienteService);
  private ciudadService = inject(CiudadService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  clientes = signal<Cliente[]>([]);
  ciudades = signal<Ciudad[]>([]);
  displayModal = signal(false);
  isEditMode = signal(false);
  loading = signal(false);
  selectedCliente = signal<Cliente | null>(null);

  ngOnInit(): void {
    this.loadClientes();
    this.loadCiudades();
  }

  loadClientes() {
    this.loading.set(true);
    this.clienteService.getAll().subscribe({
      next: (clientes) => {
        this.clienteService._clientes.set(clientes);
        this.clientes.set(this.clienteService.clientes());
        this.loading.set(false);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los clientes',
        });
        this.loading.set(false);
      },
    });
  }

  loadCiudades() {
    this.ciudadService.getAll().subscribe({
      next: (ciudades) => {
        this.ciudadService.ciudades.set(ciudades);
        this.ciudades.set(this.ciudadService.ciudades());
      },
    });
  }

  showDialog(cliente?: Cliente) {
    this.selectedCliente.set(cliente ?? null);
    this.isEditMode.set(!!cliente);
    this.displayModal.set(true);
  }

  onDialogVisibilityChange(visible: boolean) {
    this.displayModal.set(visible);
    if (!visible) {
      this.selectedCliente.set(null);
      this.isEditMode.set(false);
    }
  }

  saveCliente(clienteData: Cliente) {
    const request = this.isEditMode()
      ? this.clienteService.update(clienteData)
      : this.clienteService.save(clienteData);

    request.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Cliente ${this.isEditMode() ? 'actualizado' : 'registrado'} correctamente`,
        });
        this.displayModal.set(false);
        this.loadClientes();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un error al procesar la solicitud',
        });
      },
    });
  }

  onDialogCancel() {
    this.displayModal.set(false);
    this.selectedCliente.set(null);
    this.isEditMode.set(false);
  }

  confirmDelete(cliente: Cliente) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el cliente ${cliente.nombres}?`,
      header: 'Confirmación de Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteCliente(cliente.idPersona!);
      },
    });
  }

  private deleteCliente(id: number) {
    this.clienteService.delete(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Cliente eliminado correctamente',
        });
        this.loadClientes();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el cliente',
        });
      },
    });
  }
}
