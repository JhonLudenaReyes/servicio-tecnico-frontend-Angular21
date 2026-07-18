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
import { Tipo } from '../../../../core/models/tipo.model';

@Component({
  selector: 'app-tipo-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule],
  templateUrl: './tipo-dialog.html',
})
export class TipoDialogComponent implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() visible = false;
  @Input() tipo: Tipo | null = null;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<Tipo>();
  @Output() cancel = new EventEmitter<void>();

  tipoForm = this.fb.group({
    idTipo: [null as number | null],
    tipo: ['', [Validators.required, Validators.minLength(3)]],
  });

  get isEditMode(): boolean {
    return !!this.tipo?.idTipo;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tipo']) {
      if (this.tipo) {
        this.tipoForm.patchValue({
          idTipo: this.tipo.idTipo ?? null,
          tipo: this.tipo.tipo,
        });
      } else {
        this.tipoForm.reset();
      }
    }

    if (changes['visible'] && !this.visible) {
      this.tipoForm.reset();
    }
  }

  closeDialog(): void {
    this.visibleChange.emit(false);
    this.cancel.emit();
  }

  submit(): void {
    if (this.tipoForm.invalid) {
      this.tipoForm.markAllAsTouched();
      return;
    }

    const formValue = this.tipoForm.value as { idTipo: number | null; tipo: string };
    this.save.emit({
      idTipo: formValue.idTipo ?? undefined,
      tipo: formValue.tipo,
      estado: this.tipo?.estado ?? 'A',
    });
  }
}
