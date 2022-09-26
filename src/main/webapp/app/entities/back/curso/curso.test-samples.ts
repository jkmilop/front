import { TipoCurso } from 'app/entities/enumerations/tipo-curso.model';

import { ICurso, NewCurso } from './curso.model';

export const sampleWithRequiredData: ICurso = {
  id: 11617,
};

export const sampleWithPartialData: ICurso = {
  id: 78861,
  cursoName: 'Valenciana proyección redundant',
};

export const sampleWithFullData: ICurso = {
  id: 26165,
  cursoName: 'Home',
  tipoCurso: TipoCurso['CALCULO'],
};

export const sampleWithNewData: NewCurso = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
