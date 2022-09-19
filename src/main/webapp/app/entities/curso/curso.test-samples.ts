import { ICurso, NewCurso } from './curso.model';

export const sampleWithRequiredData: ICurso = {
  id: 11617,
  nombre: 'Metal FTP extend',
  estado: false,
};

export const sampleWithPartialData: ICurso = {
  id: 26165,
  nombre: 'Home',
  estado: false,
};

export const sampleWithFullData: ICurso = {
  id: 10800,
  nombre: 'Productor Ladrillo intangible',
  estado: false,
};

export const sampleWithNewData: NewCurso = {
  nombre: 'Granito Librería',
  estado: false,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
