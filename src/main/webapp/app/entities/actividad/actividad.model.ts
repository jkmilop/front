import { ICurso } from 'app/entities/curso/curso.model';

export interface IActividad {
  id: number;
  nombre?: string | null;
  estado?: boolean | null;
  curso?: Pick<ICurso, 'id'> | null;
}

export type NewActividad = Omit<IActividad, 'id'> & { id: null };
