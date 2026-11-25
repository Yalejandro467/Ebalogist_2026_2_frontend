import { Routes } from '@angular/router';
import { CrudPage } from './pages/crud-page/crud-page';
import { CRUD_CONFIGS } from './models/crud-configs';
import { Shell } from './layout/shell/shell';
import { Usuarios } from './pages/usuarios/usuarios';
import { MaterialComponent } from './pages/material/material';
import { ProveedorComponent } from './pages/proveedor/proveedor';
import { CompraComponent } from './pages/compra/compra';

export const routers: Routes = [
    {
        path: '',
        component: Shell,
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'usuarios'},
            { path: 'usuarios', component: Usuarios },
            { path: 'materiales', component: MaterialComponent },
            { path: 'proveedores', component: ProveedorComponent },
            { path: 'compras', component: CompraComponent },
        ],
    },
    { path: '**', redirectTo: 'usuarios' },

]
export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'usuarios' },
      { path: 'usuarios', component: CrudPage, data: { config: CRUD_CONFIGS['usuarios'] } },
      { path: 'clientes', component: CrudPage, data: { config: CRUD_CONFIGS['clientes'] } },
      { path: 'productos', component: CrudPage, data: { config: CRUD_CONFIGS['productos'] } },
      { path: 'proveedores', component: CrudPage, data: { config: CRUD_CONFIGS['proveedores'] } },
      { path: 'compras', component: CrudPage, data: { config: CRUD_CONFIGS['compras'] } },
      { path: 'ventas', component: CrudPage, data: { config: CRUD_CONFIGS['ventas'] } },
      { path: 'materiales', component: CrudPage, data: { config: CRUD_CONFIGS['materiales'] } },
      { path: 'categorias', component: CrudPage, data: { config: CRUD_CONFIGS['categorias'] } },
      { path: 'pedidos', component: CrudPage, data: { config: CRUD_CONFIGS['pedidos'] } },
      
      { path: 'detalles-pedido', component: CrudPage, data: { config: CRUD_CONFIGS['detalles-pedido'] } }
    ]
  },
  { path: '**', redirectTo: 'usuarios' }
];
