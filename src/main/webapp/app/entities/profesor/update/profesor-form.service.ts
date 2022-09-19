import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IProfesor, NewProfesor } from '../profesor.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProfesor for edit and NewProfesorFormGroupInput for create.
 */
type ProfesorFormGroupInput = IProfesor | PartialWithRequiredKeyOf<NewProfesor>;

type ProfesorFormDefaults = Pick<NewProfesor, 'id'>;

type ProfesorFormGroupContent = {
  id: FormControl<IProfesor['id'] | NewProfesor['id']>;
  nombre: FormControl<IProfesor['nombre']>;
  apellido: FormControl<IProfesor['apellido']>;
  correo: FormControl<IProfesor['correo']>;
};

export type ProfesorFormGroup = FormGroup<ProfesorFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProfesorFormService {
  createProfesorFormGroup(profesor: ProfesorFormGroupInput = { id: null }): ProfesorFormGroup {
    const profesorRawValue = {
      ...this.getFormDefaults(),
      ...profesor,
    };
    return new FormGroup<ProfesorFormGroupContent>({
      id: new FormControl(
        { value: profesorRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nombre: new FormControl(profesorRawValue.nombre, {
        validators: [Validators.required],
      }),
      apellido: new FormControl(profesorRawValue.apellido, {
        validators: [Validators.required],
      }),
      correo: new FormControl(profesorRawValue.correo, {
        validators: [Validators.required],
      }),
    });
  }

  getProfesor(form: ProfesorFormGroup): IProfesor | NewProfesor {
    return form.getRawValue() as IProfesor | NewProfesor;
  }

  resetForm(form: ProfesorFormGroup, profesor: ProfesorFormGroupInput): void {
    const profesorRawValue = { ...this.getFormDefaults(), ...profesor };
    form.reset(
      {
        ...profesorRawValue,
        id: { value: profesorRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ProfesorFormDefaults {
    return {
      id: null,
    };
  }
}
