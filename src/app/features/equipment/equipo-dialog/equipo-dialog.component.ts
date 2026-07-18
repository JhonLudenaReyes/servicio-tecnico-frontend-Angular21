import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Equipo } from '../../../core/models/equipo.model';
import { Tipo } from '../../../core/models/tipo.model';

@Component({
  selector: 'app-equipo-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
  ],
  templateUrl: './equipo-dialog.html',
})
export class EquipoDialogComponent implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() visible = false;
  @Input() equipo: Equipo | null = null;
  @Input() tipos: Tipo[] = [];

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<Equipo>();
  @Output() cancel = new EventEmitter<void>();

  equipoForm = this.fb.group({
    idEquipo: [null as number | null],
    idTipo: [null as number | null, [Validators.required]],
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

  get isEditMode(): boolean {
    return !!this.equipo?.idEquipo;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['equipo']) {
      if (this.equipo) {
        this.equipoForm.patchValue(this.equipo);
      } else {
        this.equipoForm.reset({ estado: 'A' });
      }
    }

    if (changes['visible'] && !this.visible) {
      this.equipoForm.reset({ estado: 'A' });
    }
  }

  closeDialog(): void {
    this.visibleChange.emit(false);
    this.cancel.emit();
  }

  submit(): void {
    if (this.equipoForm.invalid) {
      this.equipoForm.markAllAsTouched();
      return;
    }

    this.save.emit(this.equipoForm.value as Equipo);
  }
}
