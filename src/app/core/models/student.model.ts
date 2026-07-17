export interface Student {

  id?: number;

  usuario: {
    id?: number;
    nombres: string;
    apellidos: string;
    email: string;
    password?: string;
    estado: string;
    createdAt?: string;
  };

  codigoEstudiante: string;

  estadoAcademico: string;

}