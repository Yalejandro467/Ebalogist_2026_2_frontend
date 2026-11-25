import { CrudConfig } from './crud-config.model';

export const CRUD_CONFIGS: Record<string, CrudConfig> = {
  // ===== Entidades del backend E-Balogist (FastAPI + Neon) =====

  materiales: {
    key: 'materiales',
    idKey: 'id_material',
    title: 'Materiales',
    description: 'Gestiona el inventario de materiales.',
    basePath: '/materiales',
    listPath: '/materiales/',
    filterLabel: 'Filtrar por ID',
    filterPlaceholder: 'ID del material',
    fields: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true },
      { key: 'tipo', label: 'Tipo', type: 'text', required: true },
      { key: 'cantidad', label: 'Cantidad', type: 'number', required: true },
      { key: 'unidad', label: 'Unidad', type: 'text', required: true },
      { key: 'precio', label: 'Precio', type: 'number', required: true }
    ],
    columns: ['id_material', 'nombre', 'tipo', 'cantidad', 'unidad', 'precio']
  },

  proveedores: {
    key: 'proveedores',
    idKey: 'id_proveedor',
    title: 'Proveedores',
    description: 'Registra y consulta los proveedores.',
    basePath: '/proveedores',
    listPath: '/proveedores/',
    filterLabel: 'Filtrar por ID',
    filterPlaceholder: 'ID del proveedor',
    fields: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true },
      { key: 'tel', label: 'Teléfono', type: 'text', required: true },
      { key: 'direccion', label: 'Dirección', type: 'text', required: true },
      { key: 'correo', label: 'Correo electrónico', type: 'email', required: true }
    ],
    columns: ['id_proveedor', 'nombre', 'tel', 'direccion', 'correo']
  },

  compras: {
    key: 'compras',
    idKey: 'id_compra',
    title: 'Compras',
    description: 'Registra las compras hechas a los proveedores.',
    basePath: '/compras',
    listPath: '/compras/',
    filterLabel: 'Filtrar por ID',
    filterPlaceholder: 'ID de la compra',
    fields: [
      { key: 'fecha', label: 'Fecha', type: 'date', required: true },
      { key: 'valor_total', label: 'Valor total', type: 'number', required: true },
      { key: 'estado', label: 'Estado', type: 'text', required: true },
      { key: 'id_proveedor', label: 'ID del proveedor', type: 'text', required: true }
    ],
    columns: ['id_compra', 'fecha', 'valor_total', 'estado', 'id_proveedor']
  },

  // ===== Entidades de la plantilla (no existen en el backend) =====

  usuarios: {
    key: 'usuarios',
    title: 'Usuarios',
    description: 'Administra los usuarios registrados en E-Balogist.',
    basePath: '/usuarios',
    listPath: '/usuarios/',
    filterLabel: 'Filtrar por ID',
    filterPlaceholder: 'ID del usuario',
    fields: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true },
      { key: 'correo', label: 'Correo electrónico', type: 'email', required: true },
      { key: 'activo', label: 'Estado', type: 'boolean' }
    ],
    columns: ['id', 'nombre', 'correo', 'activo']
  },

  clientes: {
    key: 'clientes',
    title: 'Clientes',
    description: 'Registra y consulta la información de los clientes.',
    basePath: '/clientes',
    listPath: '/clientes',
    filterLabel: 'Filtrar por ID',
    filterPlaceholder: 'ID del cliente',
    fields: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true },
      { key: 'documento', label: 'Documento', type: 'text', required: true },
      { key: 'telefono', label: 'Teléfono', type: 'text', required: true },
      { key: 'correo', label: 'Correo electrónico', type: 'email', required: true },
      { key: 'direccion', label: 'Dirección', type: 'text', required: true }
    ],
    columns: ['id', 'nombre', 'documento', 'telefono', 'correo', 'direccion']
  },

  productos: {
    key: 'productos',
    title: 'Productos',
    description: 'Gestiona el catálogo de productos y sus precios.',
    basePath: '/productos',
    listPath: '/productos',
    filterLabel: 'Filtrar por ID',
    filterPlaceholder: 'ID del producto',
    fields: [
      { key: 'nombre', label: 'Nombre', type: 'text', required: true },
      { key: 'descripcion', label: 'Descripción', type: 'text', required: true },
      { key: 'categoria', label: 'Categoría', type: 'text', required: true },
      { key: 'precio', label: 'Precio', type: 'number', required: true }
    ],
    columns: ['id', 'nombre', 'descripcion', 'categoria', 'precio']
  },

  pedidos: {
    key: 'pedidos',
    title: 'Pedidos',
    description: 'Consulta y administra los pedidos de los clientes.',
    basePath: '/pedidos',
    listPath: '/pedidos',
    filterLabel: 'Filtrar por ID',
    filterPlaceholder: 'ID del pedido',
    fields: [
      { key: 'cliente_id', label: 'ID del cliente', type: 'number', required: true },
      { key: 'fecha', label: 'Fecha del pedido', type: 'date', required: true },
      { key: 'fecha_entrega', label: 'Fecha de entrega', type: 'date' },
      { key: 'estado', label: 'Estado', type: 'text', required: true },
      { key: 'direccion_entrega', label: 'Dirección de entrega', type: 'text', required: true }
    ],
    columns: ['id', 'cliente_id', 'fecha', 'fecha_entrega', 'estado', 'direccion_entrega', 'valor_total']
  },

  'detalles-pedido': {
    key: 'detalles-pedido',
    title: 'Detalles de pedido',
    description: 'Consulta los productos asociados a un pedido. Para listar, escribe el ID del pedido.',
    basePath: '/detalles-pedido',
    listPath: '/detalles-pedido',
    filterLabel: 'ID del pedido',
    filterPlaceholder: 'Escribe el ID del pedido',
    fields: [
      { key: 'pedido_id', label: 'ID del pedido', type: 'number', required: true, editOnUpdate: false },
      { key: 'producto_id', label: 'ID del producto', type: 'number', required: true, editOnUpdate: false },
      { key: 'cantidad', label: 'Cantidad', type: 'number', required: true }
    ],
    columns: ['id', 'pedido_id', 'producto_id', 'cantidad', 'precio_unitario', 'subtotal'],
    updateKeys: ['cantidad']
  }
};