import dayjs from 'dayjs/esm';

import { NombreFormato } from 'app/entities/enumerations/nombre-formato.model';

import { IActividad, NewActividad } from './actividad.model';

export const sampleWithRequiredData: IActividad = {
  id: 62070,
};

export const sampleWithPartialData: IActividad = {
  id: 60479,
  actividadName: 'wireless ejecutiva',
};

export const sampleWithFullData: IActividad = {
  id: 98859,
  actividadName: 'Loan Investigación intuitive',
  description: 'hard Bricolaje Jefe',
  fechaInicio: dayjs('2022-09-26T00:32'),
  fechaFin: dayjs('2022-09-25T20:34'),
  formato: NombreFormato['ACTIVIDAD'],
};

export const sampleWithNewData: NewActividad = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
