export interface Teacher {

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

  codigoDocente: string;

  especialidad: string;

}