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
import { Cliente } from '../../../../core/models/cliente.model';
import { Ciudad } from '../../../../core/models/ciudad.model';

@Component({
  selector: 'app-cliente-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
  ],
  templateUrl: './cliente-dialog.html',
})
export class ClienteDialogComponent implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() visible = false;
  @Input() cliente: Cliente | null = null;
  @Input() ciudades: Ciudad[] = [];

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<Cliente>();
  @Output() cancel = new EventEmitter<void>();

  clienteForm = this.fb.group({
    idPersona: [null as number | null],
    idCiudad: [null as number | null, [Validators.required]],
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

  get isEditMode(): boolean {
    return !!this.cliente?.idPersona;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cliente']) {
      if (this.cliente) {
        this.clienteForm.patchValue(this.cliente);
      } else {
        this.clienteForm.reset();
      }
    }

    if (changes['visible'] && !this.visible) {
      this.clienteForm.reset();
    }
  }

  closeDialog(): void {
    this.visibleChange.emit(false);
    this.cancel.emit();
  }

  submit(): void {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    this.save.emit(this.clienteForm.value as Cliente);
  }
}
