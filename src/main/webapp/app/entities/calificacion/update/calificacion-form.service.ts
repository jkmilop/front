import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICalificacion, NewCalificacion } from '../calificacion.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICalificacion for edit and NewCalificacionFormGroupInput for create.
 */
type CalificacionFormGroupInput = ICalificacion | PartialWithRequiredKeyOf<NewCalificacion>;

type CalificacionFormDefaults = Pick<NewCalificacion, 'id'>;

type CalificacionFormGroupContent = {
  id: FormControl<ICalificacion['id'] | NewCalificacion['id']>;
  nota: FormControl<ICalificacion['nota']>;
  actividad: FormControl<ICalificacion['actividad']>;
  estudiante: FormControl<ICalificacion['estudiante']>;
};

export type CalificacionFormGroup = FormGroup<CalificacionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CalificacionFormService {
  createCalificacionFormGroup(calificacion: CalificacionFormGroupInput = { id: null }): CalificacionFormGroup {
    const calificacionRawValue = {
      ...this.getFormDefaults(),
      ...calificacion,
    };
    return new FormGroup<CalificacionFormGroupContent>({
      id: new FormControl(
        { value: calificacionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nota: new FormControl(calificacionRawValue.nota, {
        validators: [Validators.required],
      }),
      actividad: new FormControl(calificacionRawValue.actividad),
      estudiante: new FormControl(calificacionRawValue.estudiante),
    });
  }

  getCalificacion(form: CalificacionFormGroup): ICalificacion | NewCalificacion {
    return form.getRawValue() as ICalificacion | NewCalificacion;
  }

  resetForm(form: CalificacionFormGroup, calificacion: CalificacionFormGroupInput): void {
    const calificacionRawValue = { ...this.getFormDefaults(), ...calificacion };
    form.reset(
      {
        ...calificacionRawValue,
        id: { value: calificacionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CalificacionFormDefaults {
    return {
      id: null,
    };
  }
}
