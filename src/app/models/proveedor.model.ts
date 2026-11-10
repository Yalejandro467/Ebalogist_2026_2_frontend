export interface Proveedor {
  id_proveedor: string;
  nombre: string;
  tel: string;
  direccion: string;
  correo: string;
}

export interface ProveedorCreate {
  nombre: string;
  tel: string;
  direccion: string;
  correo: string;
}

export type ProveedorUpdate = Partial<ProveedorCreate>;