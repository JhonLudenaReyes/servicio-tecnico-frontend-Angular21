import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { LucideAngularModule, Search } from 'lucide-angular';

import { ClienteService } from '../../../core/services/cliente.service';
import { CiudadService } from '../../../core/services/ciudad.service';

import { Cliente } from '../../../core/models/cliente.model';
import { Ciudad } from '../../../core/models/ciudad.model';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    IconFieldModule,
    InputIconModule,
    TagModule,
    SelectModule,
    LucideAngularModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './clientes.html',
})
export class ClientesComponent implements OnInit {
  private clienteService = inject(ClienteService);
  private ciudadService = inject(CiudadService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  clientes = signal<Cliente[]>([]);
  ciudades = signal<Ciudad[]>([]);
  displayModal = signal(false);
  isEditMode = signal(false);
  loading = signal(false);

  readonly Search = Search;

  clienteForm: FormGroup = this.fb.group({
    idPersona: [null],
    idCiudad: [null, [Validators.required]],
    nombres: ['', [Validators.required, Validators.minLength(3)]],
    apellidos: ['', [Validators.required, Validators.minLength(3)]],
    cedula: ['', [Validators.required, Validators.minLength(3)]],
    ruc: ['', [Validators.required, Validators.minLength(3)]],
    direccion: ['', [Validators.required, Validators.minLength(3)]],
    celular: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.minLength(3)]],
    telefono: ['', [Validators.required, Validators.minLength(3)]],
    telefono_adicional: ['', [Validators.required, Validators.minLength(3)]],
  });

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
    this.isEditMode.set(!!cliente);
    if (cliente) {
      this.clienteForm.patchValue(cliente);
    }
    this.displayModal.set(true);
  }

  saveCliente() {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    const clienteData = this.clienteForm.value;
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
