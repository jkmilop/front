import { IProfesor } from 'app/entities/profesor/profesor.model';

export interface ICurso {
  id: number;
  nombre?: string | null;
  estado?: boolean | null;
  profesor?: Pick<IProfesor, 'id'> | null;
}

export type NewCurso = Omit<ICurso, 'id'> & { id: null };
