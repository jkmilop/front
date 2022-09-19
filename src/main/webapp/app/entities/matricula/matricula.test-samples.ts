import { IMatricula, NewMatricula } from './matricula.model';

export const sampleWithRequiredData: IMatricula = {
  id: 55032,
};

export const sampleWithPartialData: IMatricula = {
  id: 87488,
};

export const sampleWithFullData: IMatricula = {
  id: 68888,
};

export const sampleWithNewData: NewMatricula = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
