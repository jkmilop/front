export interface IEstudiante {
  id: number;
  nombre?: string | null;
  apellido?: string | null;
  correo?: string | null;
}

export type NewEstudiante = Omit<IEstudiante, 'id'> & { id: null };
