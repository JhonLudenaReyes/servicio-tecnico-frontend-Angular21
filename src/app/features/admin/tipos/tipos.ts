import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

import { TipoService } from '../../../core/services/tipo.service';
import { Tipo } from '../../../core/models/tipo.model';
import { TipoTableComponent } from './tipo-table/tipo-table.component';
import { TipoDialogComponent } from './tipo-dialog/tipo-dialog.component';

@Component({
  selector: 'app-tipos',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TipoTableComponent,
    TipoDialogComponent,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './tipos.html',
})
export class TiposComponent implements OnInit {
  private tipoService = inject(TipoService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  tipos = signal<Tipo[]>([]);
  displayModal = signal(false);
  isEditMode = signal(false);
  loading = signal(false);
  selectedTipo = signal<Tipo | null>(null);

  ngOnInit(): void {
    this.loadTipos();
  }

  loadTipos() {
    this.loading.set(true);
    this.tipoService.getAll().subscribe({
      next: (tipos) => {
        this.tipoService._tipos.set(tipos);
        this.tipos.set(this.tipoService.tipos());
        this.loading.set(false);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los tipos de equipos',
        });
        this.loading.set(false);
      },
    });
  }

  showDialog(tipo?: Tipo) {
    this.selectedTipo.set(tipo ?? null);
    this.isEditMode.set(!!tipo);
    this.displayModal.set(true);
  }

  onDialogVisibilityChange(visible: boolean) {
    this.displayModal.set(visible);
    if (!visible) {
      this.selectedTipo.set(null);
      this.isEditMode.set(false);
    }
  }

  saveTipo(tipoData: Tipo) {
    const request = this.isEditMode()
      ? this.tipoService.update(tipoData.idTipo!, tipoData)
      : this.tipoService.save(tipoData);

    request.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Tipo de equipo ${this.isEditMode() ? 'actualizado' : 'registrado'} correctamente`,
        });
        this.displayModal.set(false);
        this.loadTipos();
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
    this.selectedTipo.set(null);
    this.isEditMode.set(false);
  }

  confirmDelete(tipo: Tipo) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el tipo: ${tipo.tipo}?`,
      header: 'Confirmación de Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteTipo(tipo.idTipo!);
      },
    });
  }

  private deleteTipo(id: number) {
    this.tipoService.delete(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Tipo de equipo eliminado correctamente',
        });
        this.loadTipos();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el tipo de equipo',
        });
      },
    });
  }
}
