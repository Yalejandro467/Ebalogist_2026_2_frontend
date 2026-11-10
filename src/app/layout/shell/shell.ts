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

  sidebarRetraido = false;

  alternarSidebar(): void {
    this.sidebarRetraido = !this.sidebarRetraido;
  }

  readonly menu = [
    { ruta: '/usuarios', etiqueta: 'Usuarios', icono: 'US' },
    { ruta: '/clientes', etiqueta: 'Clientes', icono: 'CL' },
    { ruta: '/productos', etiqueta: 'Productos', icono: 'PR' },
    { ruta: '/pedidos', etiqueta: 'Pedidos', icono: 'PE' },
    { ruta: '/detalles-pedido', etiqueta: 'Detalles de pedido', icono: 'DP' },
  ];
}