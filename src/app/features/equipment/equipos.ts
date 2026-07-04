import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EquipoService } from '../../core/services/equipo.service';
import { TipoService } from '../../core/services/tipo.service';
import { Equipo } from '../../core/models/equipo.model';
import { Tipo } from '../../core/models/tipo.model';

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

@Component({
  selector: 'app-equipos',
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
    SelectModule,
    IconFieldModule,
    InputIconModule,
    LucideAngularModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './equipos.html',
})
export class EquiposComponent implements OnInit {
  private equipoService = inject(EquipoService);
  private tipoService = inject(TipoService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  equipos = signal<Equipo[]>([]);
  tipos = signal<Tipo[]>([]);
  displayModal = signal(false);
  isEditMode = signal(false);
  loading = signal(false);

  readonly Search = Search;

  equipoForm: FormGroup = this.fb.group({
    idEquipo: [null],
    idTipo: [null, [Validators.required]],
    marca: ['', [Validators.required]],
    modelo: ['', [Validators.required]],
    serie: ['', [Validators.required]],
    mainboard: [''],
    procesador: [''],
    memoria: [''],
    discoDuro: [''],
    fuente: [''],
    case: [''],
    estado: ['A', [Validators.required]],
  });

  ngOnInit(): void {
    this.loadEquipos();
    this.loadTipos();
  }

  loadEquipos() {
    this.loading.set(true);
    this.equipoService.getAll().subscribe({
      next: (data) => {
        this.equipos.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los equipos',
        });
        this.loading.set(false);
      },
    });
  }

  loadTipos() {
    this.tipoService.getAll().subscribe({
      next: (tipos) => {
        this.tipos.set(tipos);
        console.log(this.tipos());
      },
    });
  }

  showDialog(equipo?: Equipo) {
    this.isEditMode.set(!!equipo);
    if (equipo) {
      this.equipoForm.patchValue(equipo);
    } else {
      this.equipoForm.reset({ estado: 'A' });
    }
    this.displayModal.set(true);
  }

  saveEquipo() {
    if (this.equipoForm.invalid) {
      this.equipoForm.markAllAsTouched();
      return;
    }

    const equipoData = this.equipoForm.value;
    const request = this.isEditMode()
      ? this.equipoService.update(equipoData.idEquipo, equipoData)
      : this.equipoService.save(equipoData);

    request.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Equipo ${this.isEditMode() ? 'actualizado' : 'registrado'} correctamente`,
        });
        this.displayModal.set(false);
        this.loadEquipos();
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

  confirmDelete(equipo: Equipo) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el equipo ${equipo.marca} ${equipo.modelo} (S/N: ${equipo.serie})?`,
      header: 'Confirmación de Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteEquipo(equipo.idEquipo!);
      },
    });
  }

  private deleteEquipo(id: number) {
    this.equipoService.delete(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Equipo eliminado correctamente',
        });
        this.loadEquipos();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el equipo',
        });
      },
    });
  }
}
