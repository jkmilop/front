import { IActividad } from 'app/entities/actividad/actividad.model';
import { IEstudiante } from 'app/entities/estudiante/estudiante.model';

export interface ICalificacion {
  id: number;
  nota?: number | null;
  actividad?: Pick<IActividad, 'id'> | null;
  estudiante?: Pick<IEstudiante, 'id'> | null;
}

export type NewCalificacion = Omit<ICalificacion, 'id'> & { id: null };
