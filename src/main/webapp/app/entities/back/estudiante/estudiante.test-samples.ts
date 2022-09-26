import { IEstudiante, NewEstudiante } from './estudiante.model';

export const sampleWithRequiredData: IEstudiante = {
  id: 8970,
};

export const sampleWithPartialData: IEstudiante = {
  id: 83335,
  estudianteName: 'deploy Mancha optical',
  codigoEstudiante: 'Islandia',
  correo: 'Plástico',
};

export const sampleWithFullData: IEstudiante = {
  id: 14344,
  estudianteName: 'Bricolaje global',
  codigoEstudiante: 'Proactivo navigate',
  correo: 'Peso bandwidth Increible',
};

export const sampleWithNewData: NewEstudiante = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
