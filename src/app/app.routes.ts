import { Routes } from '@angular/router';

import { Shell } from './layout/shell/shell';
import { Usuarios } from './pages/usuarios/usuarios';
import { MaterialComponent } from './pages/material/material';
import { ProveedorComponent } from './pages/proveedor/proveedor';
import { CompraComponent } from './pages/compra/compra';

export const routes: Routes = [
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
];
