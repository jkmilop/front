import { IEstudiante } from 'app/entities/back/estudiante/estudiante.model';
import { IActividad } from 'app/entities/back/actividad/actividad.model';

export interface IDesarrollo {
  id: number;
  terminado?: boolean | null;
  nota?: number | null;
  estudiante?: Pick<IEstudiante, 'id'> | null;
  actividad?: Pick<IActividad, 'id'> | null;
}

export type NewDesarrollo = Omit<IDesarrollo, 'id'> & { id: null };
