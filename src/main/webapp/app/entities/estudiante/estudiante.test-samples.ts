import { IEstudiante, NewEstudiante } from './estudiante.model';

export const sampleWithRequiredData: IEstudiante = {
  id: 8970,
  nombre: 'Adelante Regional maximizada',
  apellido: 'optical Sorprendente Plástico',
  correo: 'Argentina',
};

export const sampleWithPartialData: IEstudiante = {
  id: 64475,
  nombre: 'uniforme Proactivo',
  apellido: 'monetize Peso bandwidth',
  correo: 'extranet',
};

export const sampleWithFullData: IEstudiante = {
  id: 49388,
  nombre: 'Bután',
  apellido: 'Distrito Madera',
  correo: 'León generación Teclado',
};

export const sampleWithNewData: NewEstudiante = {
  nombre: 'Salud programming',
  apellido: 'schemas',
  correo: 'Hormigon',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
