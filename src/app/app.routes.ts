import { Routes } from '@angular/router';
import { Shell } from './layout/shell/shell';
import { CrudPage } from './pages/crud-page/crud-page';
import { CRUD_CONFIGS } from './models/crud-configs';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'usuarios' },
      { path: 'usuarios', component: CrudPage, data: { config: CRUD_CONFIGS['usuarios'] } },
      { path: 'clientes', component: CrudPage, data: { config: CRUD_CONFIGS['clientes'] } },
      { path: 'productos', component: CrudPage, data: { config: CRUD_CONFIGS['productos'] } },
      { path: 'pedidos', component: CrudPage, data: { config: CRUD_CONFIGS['pedidos'] } },
      { path: 'detalles-pedido', component: CrudPage, data: { config: CRUD_CONFIGS['detalles-pedido'] } }
    ]
  },
  { path: '**', redirectTo: 'usuarios' }
];
