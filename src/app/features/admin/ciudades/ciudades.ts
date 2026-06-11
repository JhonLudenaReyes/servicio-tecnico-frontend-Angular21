import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CiudadService } from '../../../core/services/ciudad.service';
import { Ciudad } from '../../../core/models/ciudad.model';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-ciudades',
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
    TagModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './ciudades.html',
})
export class CiudadesComponent implements OnInit {
  private ciudadService = inject(CiudadService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  ciudades = signal<Ciudad[]>([]);
  displayModal = signal(false);
  isEditMode = signal(false);
  loading = signal(false);

  ciudadForm: FormGroup = this.fb.group({
    idCiudad: [null],
    ciudad: ['', [Validators.required, Validators.minLength(3)]],
  });

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
    this.isEditMode.set(!!ciudad);
    if (ciudad) {
      this.ciudadForm.patchValue(ciudad);
    }
    this.displayModal.set(true);
  }

  saveCiudad() {
    if (this.ciudadForm.invalid) {
      this.ciudadForm.markAllAsTouched();
      return;
    }

    const ciudadData = this.ciudadForm.value;
    const request = this.isEditMode()
      ? this.ciudadService.update(ciudadData.idCiudad, ciudadData)
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
