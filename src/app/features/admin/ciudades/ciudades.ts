import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

import { CiudadService } from '../../../core/services/ciudad.service';
import { Ciudad } from '../../../core/models/ciudad.model';
import { CiudadTableComponent } from './ciudad-table.component';
import { CiudadDialogComponent } from './ciudad-dialog.component';

@Component({
  selector: 'app-ciudades',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CiudadTableComponent,
    CiudadDialogComponent,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './ciudades.html',
})
export class CiudadesComponent implements OnInit {
  private ciudadService = inject(CiudadService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  ciudades = signal<Ciudad[]>([]);
  displayModal = signal(false);
  isEditMode = signal(false);
  loading = signal(false);
  selectedCiudad = signal<Ciudad | null>(null);

  ngOnInit(): void {
    this.loadCiudades();
  }

  loadCiudades() {
    this.loading.set(true);
    this.ciudadService.getAll().subscribe({
      next: (ciudades) => {
        this.ciudadService._ciudades.set(ciudades);
        this.ciudades.set(this.ciudadService.ciudades());
        this.loading.set(false);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las ciudades',
        });
        this.loading.set(false);
      },
    });
  }

  showDialog(ciudad?: Ciudad) {
    this.selectedCiudad.set(ciudad ?? null);
    this.isEditMode.set(!!ciudad);
    this.displayModal.set(true);
  }

  onDialogVisibilityChange(visible: boolean) {
    this.displayModal.set(visible);
    if (!visible) {
      this.selectedCiudad.set(null);
      this.isEditMode.set(false);
    }
  }

  saveCiudad(ciudadData: Ciudad) {
    const request = this.isEditMode()
      ? this.ciudadService.update(ciudadData.idCiudad!, ciudadData)
      : this.ciudadService.save(ciudadData);

    request.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Ciudad ${this.isEditMode() ? 'actualizada' : 'registrada'} correctamente`,
        });
        this.displayModal.set(false);
        this.loadCiudades();
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
    this.selectedCiudad.set(null);
    this.isEditMode.set(false);
  }

  confirmDelete(ciudad: Ciudad) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar la ciudad ${ciudad.ciudad}?`,
      header: 'Confirmación de Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteCiudad(ciudad.idCiudad!);
      },
    });
  }

  private deleteCiudad(id: number) {
    this.ciudadService.delete(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Ciudad eliminada correctamente',
        });
        this.loadCiudades();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la ciudad',
        });
      },
    });
  }
}
