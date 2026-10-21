export interface Usuario {
    id: number;
    nombre: string;
    correo: string;
    activo: boolean;
  }
  
  export interface UsuarioCreate {
    nombre: string;
    correo: string;
    activo: boolean;
  }
  
  export interface UsuarioUpdate {
    nombre?: string;
    correo?: string;
    activo?: boolean;
  }
  