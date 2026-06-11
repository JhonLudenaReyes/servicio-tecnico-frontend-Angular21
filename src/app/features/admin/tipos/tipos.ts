import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TipoService } from '../../../core/services/tipo.service';
import { Tipo } from '../../../core/models/tipo.model';

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
  selector: 'app-tipos',
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
  templateUrl: './tipos.html',
})
export class TiposComponent implements OnInit {
  private tipoService = inject(TipoService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  tipos = signal<Tipo[]>([]);
  displayModal = signal(false);
  isEditMode = signal(false);
  loading = signal(false);

  tipoForm: FormGroup = this.fb.group({
    idTipo: [null],
    tipo: ['', [Validators.required, Validators.minLength(3)]],
  });

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
    this.isEditMode.set(!!tipo);
    if (tipo) {
      this.tipoForm.patchValue(tipo);
    }
    this.displayModal.set(true);
  }

  saveTipo() {
    if (this.tipoForm.invalid) {
      this.tipoForm.markAllAsTouched();
      return;
    }

    const tipoData = this.tipoForm.value;
    const request = this.isEditMode()
      ? this.tipoService.update(tipoData.idTipo, tipoData)
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
