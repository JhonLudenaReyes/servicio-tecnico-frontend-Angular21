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
import { Ciudad } from '../../../core/models/ciudad.model';

@Component({
  selector: 'app-ciudad-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule],
  templateUrl: './ciudad-dialog.html',
})
export class CiudadDialogComponent implements OnChanges {
  private fb = inject(FormBuilder);

  @Input() visible = false;
  @Input() ciudad: Ciudad | null = null;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<Ciudad>();
  @Output() cancel = new EventEmitter<void>();

  ciudadForm = this.fb.group({
    idCiudad: [null as number | null],
    ciudad: ['', [Validators.required, Validators.minLength(3)]],
  });

  get isEditMode(): boolean {
    return !!this.ciudad?.idCiudad;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ciudad']) {
      if (this.ciudad) {
        this.ciudadForm.patchValue({
          idCiudad: this.ciudad.idCiudad ?? null,
          ciudad: this.ciudad.ciudad,
        });
      } else {
        this.ciudadForm.reset();
      }
    }

    if (changes['visible'] && !this.visible) {
      this.ciudadForm.reset();
    }
  }

  closeDialog(): void {
    this.visibleChange.emit(false);
    this.cancel.emit();
  }

  submit(): void {
    if (this.ciudadForm.invalid) {
      this.ciudadForm.markAllAsTouched();
      return;
    }

    const formValue = this.ciudadForm.value as { idCiudad: number | null; ciudad: string };
    this.save.emit({
      idCiudad: formValue.idCiudad ?? undefined,
      ciudad: formValue.ciudad,
      estado: this.ciudad?.estado ?? 'A',
    });
  }
}
