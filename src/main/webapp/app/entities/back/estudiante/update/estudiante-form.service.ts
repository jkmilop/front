import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IEstudiante, NewEstudiante } from '../estudiante.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEstudiante for edit and NewEstudianteFormGroupInput for create.
 */
type EstudianteFormGroupInput = IEstudiante | PartialWithRequiredKeyOf<NewEstudiante>;

type EstudianteFormDefaults = Pick<NewEstudiante, 'id'>;

type EstudianteFormGroupContent = {
  id: FormControl<IEstudiante['id'] | NewEstudiante['id']>;
  estudianteName: FormControl<IEstudiante['estudianteName']>;
  codigoEstudiante: FormControl<IEstudiante['codigoEstudiante']>;
  correo: FormControl<IEstudiante['correo']>;
};

export type EstudianteFormGroup = FormGroup<EstudianteFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EstudianteFormService {
  createEstudianteFormGroup(estudiante: EstudianteFormGroupInput = { id: null }): EstudianteFormGroup {
    const estudianteRawValue = {
      ...this.getFormDefaults(),
      ...estudiante,
    };
    return new FormGroup<EstudianteFormGroupContent>({
      id: new FormControl(
        { value: estudianteRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      estudianteName: new FormControl(estudianteRawValue.estudianteName),
      codigoEstudiante: new FormControl(estudianteRawValue.codigoEstudiante),
      correo: new FormControl(estudianteRawValue.correo),
    });
  }

  getEstudiante(form: EstudianteFormGroup): IEstudiante | NewEstudiante {
    return form.getRawValue() as IEstudiante | NewEstudiante;
  }

  resetForm(form: EstudianteFormGroup, estudiante: EstudianteFormGroupInput): void {
    const estudianteRawValue = { ...this.getFormDefaults(), ...estudiante };
    form.reset(
      {
        ...estudianteRawValue,
        id: { value: estudianteRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): EstudianteFormDefaults {
    return {
      id: null,
    };
  }
}
