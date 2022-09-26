import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IEstudianteCurso, NewEstudianteCurso } from '../estudiante-curso.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEstudianteCurso for edit and NewEstudianteCursoFormGroupInput for create.
 */
type EstudianteCursoFormGroupInput = IEstudianteCurso | PartialWithRequiredKeyOf<NewEstudianteCurso>;

type EstudianteCursoFormDefaults = Pick<NewEstudianteCurso, 'id'>;

type EstudianteCursoFormGroupContent = {
  id: FormControl<IEstudianteCurso['id'] | NewEstudianteCurso['id']>;
  curso: FormControl<IEstudianteCurso['curso']>;
  estudiante: FormControl<IEstudianteCurso['estudiante']>;
};

export type EstudianteCursoFormGroup = FormGroup<EstudianteCursoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EstudianteCursoFormService {
  createEstudianteCursoFormGroup(estudianteCurso: EstudianteCursoFormGroupInput = { id: null }): EstudianteCursoFormGroup {
    const estudianteCursoRawValue = {
      ...this.getFormDefaults(),
      ...estudianteCurso,
    };
    return new FormGroup<EstudianteCursoFormGroupContent>({
      id: new FormControl(
        { value: estudianteCursoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      curso: new FormControl(estudianteCursoRawValue.curso),
      estudiante: new FormControl(estudianteCursoRawValue.estudiante),
    });
  }

  getEstudianteCurso(form: EstudianteCursoFormGroup): IEstudianteCurso | NewEstudianteCurso {
    return form.getRawValue() as IEstudianteCurso | NewEstudianteCurso;
  }

  resetForm(form: EstudianteCursoFormGroup, estudianteCurso: EstudianteCursoFormGroupInput): void {
    const estudianteCursoRawValue = { ...this.getFormDefaults(), ...estudianteCurso };
    form.reset(
      {
        ...estudianteCursoRawValue,
        id: { value: estudianteCursoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): EstudianteCursoFormDefaults {
    return {
      id: null,
    };
  }
}
