export interface Compra {
  id_compra: string;
  fecha: string;
  valor_total: number;
  estado: string;
  id_proveedor: string | null;
}

export interface CompraCreate {
  fecha?: string;
  valor_total: number;
  estado?: string;
  id_proveedor?: string | null;
}

export type CompraUpdate = Partial<CompraCreate>;