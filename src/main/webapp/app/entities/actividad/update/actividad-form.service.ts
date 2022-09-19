import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IActividad, NewActividad } from '../actividad.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IActividad for edit and NewActividadFormGroupInput for create.
 */
type ActividadFormGroupInput = IActividad | PartialWithRequiredKeyOf<NewActividad>;

type ActividadFormDefaults = Pick<NewActividad, 'id' | 'estado'>;

type ActividadFormGroupContent = {
  id: FormControl<IActividad['id'] | NewActividad['id']>;
  nombre: FormControl<IActividad['nombre']>;
  estado: FormControl<IActividad['estado']>;
  curso: FormControl<IActividad['curso']>;
};

export type ActividadFormGroup = FormGroup<ActividadFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ActividadFormService {
  createActividadFormGroup(actividad: ActividadFormGroupInput = { id: null }): ActividadFormGroup {
    const actividadRawValue = {
      ...this.getFormDefaults(),
      ...actividad,
    };
    return new FormGroup<ActividadFormGroupContent>({
      id: new FormControl(
        { value: actividadRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nombre: new FormControl(actividadRawValue.nombre, {
        validators: [Validators.required],
      }),
      estado: new FormControl(actividadRawValue.estado, {
        validators: [Validators.required],
      }),
      curso: new FormControl(actividadRawValue.curso),
    });
  }

  getActividad(form: ActividadFormGroup): IActividad | NewActividad {
    return form.getRawValue() as IActividad | NewActividad;
  }

  resetForm(form: ActividadFormGroup, actividad: ActividadFormGroupInput): void {
    const actividadRawValue = { ...this.getFormDefaults(), ...actividad };
    form.reset(
      {
        ...actividadRawValue,
        id: { value: actividadRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ActividadFormDefaults {
    return {
      id: null,
      estado: false,
    };
  }
}
