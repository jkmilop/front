export interface IProfesor {
  id: number;
  profesorName?: string | null;
  codigoProfesor?: string | null;
  correo?: string | null;
}

export type NewProfesor = Omit<IProfesor, 'id'> & { id: null };
