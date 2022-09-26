import { IDesarrollo, NewDesarrollo } from './desarrollo.model';

export const sampleWithRequiredData: IDesarrollo = {
  id: 44518,
};

export const sampleWithPartialData: IDesarrollo = {
  id: 30879,
};

export const sampleWithFullData: IDesarrollo = {
  id: 12863,
  terminado: true,
  nota: 45701,
};

export const sampleWithNewData: NewDesarrollo = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
