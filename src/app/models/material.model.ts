export interface Material {
  id_material: string;
  nombre: string;
  tipo: string;
  cantidad: number;
  unidad: string;
  precio: number;
}

export interface MaterialCreate {
  nombre: string;
  tipo: string;
  cantidad: number;
  unidad: string;
  precio: number;
}

export type MaterialUpdate = Partial<MaterialCreate>;