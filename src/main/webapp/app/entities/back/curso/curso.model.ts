import { IProfesor } from 'app/entities/back/profesor/profesor.model';
import { TipoCurso } from 'app/entities/enumerations/tipo-curso.model';

export interface ICurso {
  id: number;
  cursoName?: string | null;
  tipoCurso?: TipoCurso | null;
  profesor?: Pick<IProfesor, 'id'> | null;
}

export type NewCurso = Omit<ICurso, 'id'> & { id: null };
