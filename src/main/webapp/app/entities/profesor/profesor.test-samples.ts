import { IProfesor, NewProfesor } from './profesor.model';

export const sampleWithRequiredData: IProfesor = {
  id: 26871,
  nombre: 'Acero HDD Avanzado',
  apellido: 'Conjunto Arquitecto',
  correo: 'Actualizable previsión Música',
};

export const sampleWithPartialData: IProfesor = {
  id: 66302,
  nombre: 'Fiji',
  apellido: 'Papelería',
  correo: 'RSS Bebes',
};

export const sampleWithFullData: IProfesor = {
  id: 92281,
  nombre: 'Hecho',
  apellido: 'Especialista Manzana',
  correo: 'canal',
};

export const sampleWithNewData: NewProfesor = {
  nombre: 'Reducido',
  apellido: 'Agente Consultor',
  correo: 'wireless target Dollar',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
