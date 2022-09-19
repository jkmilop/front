import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMatricula, NewMatricula } from '../matricula.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMatricula for edit and NewMatriculaFormGroupInput for create.
 */
type MatriculaFormGroupInput = IMatricula | PartialWithRequiredKeyOf<NewMatricula>;

type MatriculaFormDefaults = Pick<NewMatricula, 'id'>;

type MatriculaFormGroupContent = {
  id: FormControl<IMatricula['id'] | NewMatricula['id']>;
  estudiante: FormControl<IMatricula['estudiante']>;
  curso: FormControl<IMatricula['curso']>;
};

export type MatriculaFormGroup = FormGroup<MatriculaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MatriculaFormService {
  createMatriculaFormGroup(matricula: MatriculaFormGroupInput = { id: null }): MatriculaFormGroup {
    const matriculaRawValue = {
      ...this.getFormDefaults(),
      ...matricula,
    };
    return new FormGroup<MatriculaFormGroupContent>({
      id: new FormControl(
        { value: matriculaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      estudiante: new FormControl(matriculaRawValue.estudiante),
      curso: new FormControl(matriculaRawValue.curso),
    });
  }

  getMatricula(form: MatriculaFormGroup): IMatricula | NewMatricula {
    return form.getRawValue() as IMatricula | NewMatricula;
  }

  resetForm(form: MatriculaFormGroup, matricula: MatriculaFormGroupInput): void {
    const matriculaRawValue = { ...this.getFormDefaults(), ...matricula };
    form.reset(
      {
        ...matriculaRawValue,
        id: { value: matriculaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MatriculaFormDefaults {
    return {
      id: null,
    };
  }
}
