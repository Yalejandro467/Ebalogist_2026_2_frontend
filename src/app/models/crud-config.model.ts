export type CampoTipo = 'text' | 'email' | 'number' | 'date' | 'boolean';

export interface CrudField {
  key: string;
  label: string;
  type: CampoTipo;
  required?: boolean;
  editOnUpdate?: boolean;
}

export interface CrudConfig {
  key: string;
  /** Nombre del campo id en la API (p. ej. 'id_material'). Si no se indica, se usa 'id'. */
  idKey?: string;
  title: string;
  description: string;
  basePath: string;
  listPath: string;
  fields: CrudField[];
  columns: string[];
  filterLabel?: string;
  filterPlaceholder?: string;
  updateKeys?: string[];
}