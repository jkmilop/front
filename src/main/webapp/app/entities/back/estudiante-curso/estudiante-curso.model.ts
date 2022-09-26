import { ICurso } from 'app/entities/back/curso/curso.model';
import { IEstudiante } from 'app/entities/back/estudiante/estudiante.model';

export interface IEstudianteCurso {
  id: number;
  curso?: Pick<ICurso, 'id'> | null;
  estudiante?: Pick<IEstudiante, 'id'> | null;
}

export type NewEstudianteCurso = Omit<IEstudianteCurso, 'id'> & { id: null };
