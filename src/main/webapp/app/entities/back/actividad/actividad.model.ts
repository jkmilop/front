import dayjs from 'dayjs/esm';
import { ICurso } from 'app/entities/back/curso/curso.model';
import { NombreFormato } from 'app/entities/enumerations/nombre-formato.model';

export interface IActividad {
  id: number;
  actividadName?: string | null;
  description?: string | null;
  fechaInicio?: dayjs.Dayjs | null;
  fechaFin?: dayjs.Dayjs | null;
  formato?: NombreFormato | null;
  curso?: Pick<ICurso, 'id'> | null;
}

export type NewActividad = Omit<IActividad, 'id'> & { id: null };
