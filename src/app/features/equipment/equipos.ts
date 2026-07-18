import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { LucideAngularModule, Search } from 'lucide-angular';

import { EquipoService } from '../../core/services/equipo.service';
import { TipoService } from '../../core/services/tipo.service';
import { Equipo } from '../../core/models/equipo.model';
import { Tipo } from '../../core/models/tipo.model';
import { EquipoTableComponent } from './equipo-table/equipo-table.component';
import { EquipoDialogComponent } from './equipo-dialog/equipo-dialog.component';

@Component({
  selector: 'app-equipos',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    EquipoTableComponent,
    EquipoDialogComponent,
    ToastModule,
    ConfirmDialogModule,
    LucideAngularModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './equipos.html',
})
export class EquiposComponent implements OnInit {
  private equipoService = inject(EquipoService);
  private tipoService = inject(TipoService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  equipos = signal<Equipo[]>([]);
  tipos = signal<Tipo[]>([]);
  displayModal = signal(false);
  isEditMode = signal(false);
  loading = signal(false);
  selectedEquipo = signal<Equipo | null>(null);

  readonly Search = Search;

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
      },
    });
  }

  showDialog(equipo?: Equipo) {
    this.selectedEquipo.set(equipo ?? null);
    this.isEditMode.set(!!equipo);
    this.displayModal.set(true);
  }

  onDialogVisibilityChange(visible: boolean) {
    this.displayModal.set(visible);
    if (!visible) {
      this.selectedEquipo.set(null);
      this.isEditMode.set(false);
    }
  }

  saveEquipo(equipoData: Equipo) {
    const request = this.isEditMode()
      ? this.equipoService.update(equipoData.idEquipo!, equipoData)
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

  onDialogCancel() {
    this.displayModal.set(false);
    this.selectedEquipo.set(null);
    this.isEditMode.set(false);
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
