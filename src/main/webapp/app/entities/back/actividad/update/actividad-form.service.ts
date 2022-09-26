import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
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

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IActividad | NewActividad> = Omit<T, 'fechaInicio' | 'fechaFin'> & {
  fechaInicio?: string | null;
  fechaFin?: string | null;
};

type ActividadFormRawValue = FormValueOf<IActividad>;

type NewActividadFormRawValue = FormValueOf<NewActividad>;

type ActividadFormDefaults = Pick<NewActividad, 'id' | 'fechaInicio' | 'fechaFin'>;

type ActividadFormGroupContent = {
  id: FormControl<ActividadFormRawValue['id'] | NewActividad['id']>;
  actividadName: FormControl<ActividadFormRawValue['actividadName']>;
  description: FormControl<ActividadFormRawValue['description']>;
  fechaInicio: FormControl<ActividadFormRawValue['fechaInicio']>;
  fechaFin: FormControl<ActividadFormRawValue['fechaFin']>;
  formato: FormControl<ActividadFormRawValue['formato']>;
  curso: FormControl<ActividadFormRawValue['curso']>;
};

export type ActividadFormGroup = FormGroup<ActividadFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ActividadFormService {
  createActividadFormGroup(actividad: ActividadFormGroupInput = { id: null }): ActividadFormGroup {
    const actividadRawValue = this.convertActividadToActividadRawValue({
      ...this.getFormDefaults(),
      ...actividad,
    });
    return new FormGroup<ActividadFormGroupContent>({
      id: new FormControl(
        { value: actividadRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      actividadName: new FormControl(actividadRawValue.actividadName),
      description: new FormControl(actividadRawValue.description),
      fechaInicio: new FormControl(actividadRawValue.fechaInicio),
      fechaFin: new FormControl(actividadRawValue.fechaFin),
      formato: new FormControl(actividadRawValue.formato),
      curso: new FormControl(actividadRawValue.curso),
    });
  }

  getActividad(form: ActividadFormGroup): IActividad | NewActividad {
    return this.convertActividadRawValueToActividad(form.getRawValue() as ActividadFormRawValue | NewActividadFormRawValue);
  }

  resetForm(form: ActividadFormGroup, actividad: ActividadFormGroupInput): void {
    const actividadRawValue = this.convertActividadToActividadRawValue({ ...this.getFormDefaults(), ...actividad });
    form.reset(
      {
        ...actividadRawValue,
        id: { value: actividadRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ActividadFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      fechaInicio: currentTime,
      fechaFin: currentTime,
    };
  }

  private convertActividadRawValueToActividad(rawActividad: ActividadFormRawValue | NewActividadFormRawValue): IActividad | NewActividad {
    return {
      ...rawActividad,
      fechaInicio: dayjs(rawActividad.fechaInicio, DATE_TIME_FORMAT),
      fechaFin: dayjs(rawActividad.fechaFin, DATE_TIME_FORMAT),
    };
  }

  private convertActividadToActividadRawValue(
    actividad: IActividad | (Partial<NewActividad> & ActividadFormDefaults)
  ): ActividadFormRawValue | PartialWithRequiredKeyOf<NewActividadFormRawValue> {
    return {
      ...actividad,
      fechaInicio: actividad.fechaInicio ? actividad.fechaInicio.format(DATE_TIME_FORMAT) : undefined,
      fechaFin: actividad.fechaFin ? actividad.fechaFin.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
