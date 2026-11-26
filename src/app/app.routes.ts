import { Routes } from '@angular/router';
import { CrudPage } from './pages/crud-page/crud-page';
import { CRUD_CONFIGS } from './models/crud-configs';
import { Shell } from './layout/shell/shell';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'materiales' },
      { path: 'materiales', component: CrudPage, data: { config: CRUD_CONFIGS['materiales'] } },
      { path: 'proveedores', component: CrudPage, data: { config: CRUD_CONFIGS['proveedores'] } },
      { path: 'compras', component: CrudPage, data: { config: CRUD_CONFIGS['compras'] } },
      { path: 'clientes', component: CrudPage, data: { config: CRUD_CONFIGS['clientes'] } },
      { path: 'productos', component: CrudPage, data: { config: CRUD_CONFIGS['productos'] } },
      { path: 'pedidos', component: CrudPage, data: { config: CRUD_CONFIGS['pedidos'] } },
      { path: 'detalles-pedido', component: CrudPage, data: { config: CRUD_CONFIGS['detalles-pedido'] } }
    ]
  },
  { path: '**', redirectTo: 'materiales' }
];