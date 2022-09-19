import { IEstudiante } from 'app/entities/estudiante/estudiante.model';
import { ICurso } from 'app/entities/curso/curso.model';

export interface IMatricula {
  id: number;
  estudiante?: Pick<IEstudiante, 'id'> | null;
  curso?: Pick<ICurso, 'id'> | null;
}

export type NewMatricula = Omit<IMatricula, 'id'> & { id: null };
