import { ICalificacion, NewCalificacion } from './calificacion.model';

export const sampleWithRequiredData: ICalificacion = {
  id: 37751,
  nota: 44374,
};

export const sampleWithPartialData: ICalificacion = {
  id: 78480,
  nota: 80668,
};

export const sampleWithFullData: ICalificacion = {
  id: 88411,
  nota: 74658,
};

export const sampleWithNewData: NewCalificacion = {
  nota: 81293,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
