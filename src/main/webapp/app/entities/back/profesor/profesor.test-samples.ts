import { IProfesor, NewProfesor } from './profesor.model';

export const sampleWithRequiredData: IProfesor = {
  id: 26871,
};

export const sampleWithPartialData: IProfesor = {
  id: 10849,
  profesorName: 'Tala',
  correo: 'Avanzado',
};

export const sampleWithFullData: IProfesor = {
  id: 42534,
  profesorName: 'Opcional Extrarradio',
  codigoProfesor: 'Seguro',
  correo: 'up bandwidth',
};

export const sampleWithNewData: NewProfesor = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
