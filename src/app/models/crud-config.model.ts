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
