import { IActividad, NewActividad } from './actividad.model';

export const sampleWithRequiredData: IActividad = {
  id: 62070,
  nombre: 'Entrada e-commerce wireless',
  estado: false,
};

export const sampleWithPartialData: IActividad = {
  id: 35194,
  nombre: 'Consultor bluetooth Algodón',
  estado: false,
};

export const sampleWithFullData: IActividad = {
  id: 77549,
  nombre: 'hard Bricolaje Jefe',
  estado: false,
};

export const sampleWithNewData: NewActividad = {
  nombre: 'robust',
  estado: true,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
