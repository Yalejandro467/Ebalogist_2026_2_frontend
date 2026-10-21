
import { Component } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

@Component({
  selector: 'app-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  readonly menu = [
    { ruta: '/usuarios', etiqueta: 'Usuarios' },
    { ruta: '/clientes', etiqueta: 'Clientes' },
    { ruta: '/productos', etiqueta: 'Productos' },
    { ruta: '/pedidos', etiqueta: 'Pedidos' },
    { ruta: '/detalles-pedido', etiqueta: 'Detalles de pedido' },
  ];
}
