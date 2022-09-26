export interface IEstudiante {
  id: number;
  estudianteName?: string | null;
  codigoEstudiante?: string | null;
  correo?: string | null;
}

export type NewEstudiante = Omit<IEstudiante, 'id'> & { id: null };
