import { IEstudianteCurso, NewEstudianteCurso } from './estudiante-curso.model';

export const sampleWithRequiredData: IEstudianteCurso = {
  id: 39415,
};

export const sampleWithPartialData: IEstudianteCurso = {
  id: 56364,
};

export const sampleWithFullData: IEstudianteCurso = {
  id: 34399,
};

export const sampleWithNewData: NewEstudianteCurso = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
