export interface IProfesor {
  id: number;
  nombre?: string | null;
  apellido?: string | null;
  correo?: string | null;
}

export type NewProfesor = Omit<IProfesor, 'id'> & { id: null };
