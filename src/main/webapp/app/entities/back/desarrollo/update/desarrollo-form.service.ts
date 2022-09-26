import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IDesarrollo, NewDesarrollo } from '../desarrollo.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDesarrollo for edit and NewDesarrolloFormGroupInput for create.
 */
type DesarrolloFormGroupInput = IDesarrollo | PartialWithRequiredKeyOf<NewDesarrollo>;

type DesarrolloFormDefaults = Pick<NewDesarrollo, 'id' | 'terminado'>;

type DesarrolloFormGroupContent = {
  id: FormControl<IDesarrollo['id'] | NewDesarrollo['id']>;
  terminado: FormControl<IDesarrollo['terminado']>;
  nota: FormControl<IDesarrollo['nota']>;
  estudiante: FormControl<IDesarrollo['estudiante']>;
  actividad: FormControl<IDesarrollo['actividad']>;
};

export type DesarrolloFormGroup = FormGroup<DesarrolloFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DesarrolloFormService {
  createDesarrolloFormGroup(desarrollo: DesarrolloFormGroupInput = { id: null }): DesarrolloFormGroup {
    const desarrolloRawValue = {
      ...this.getFormDefaults(),
      ...desarrollo,
    };
    return new FormGroup<DesarrolloFormGroupContent>({
      id: new FormControl(
        { value: desarrolloRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      terminado: new FormControl(desarrolloRawValue.terminado),
      nota: new FormControl(desarrolloRawValue.nota),
      estudiante: new FormControl(desarrolloRawValue.estudiante),
      actividad: new FormControl(desarrolloRawValue.actividad),
    });
  }

  getDesarrollo(form: DesarrolloFormGroup): IDesarrollo | NewDesarrollo {
    return form.getRawValue() as IDesarrollo | NewDesarrollo;
  }

  resetForm(form: DesarrolloFormGroup, desarrollo: DesarrolloFormGroupInput): void {
    const desarrolloRawValue = { ...this.getFormDefaults(), ...desarrollo };
    form.reset(
      {
        ...desarrolloRawValue,
        id: { value: desarrolloRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DesarrolloFormDefaults {
    return {
      id: null,
      terminado: false,
    };
  }
}
