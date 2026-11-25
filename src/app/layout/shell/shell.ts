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
  // Estado para saber si el sidebar está retraído
  isSidebarCollapsed = false;

  readonly menu = [
    { ruta: '/usuarios', etiqueta: 'Usuarios' },
    { ruta: '/clientes', etiqueta: 'Clientes' },
    { ruta: '/productos', etiqueta: 'Productos' },
    { ruta: '/pedidos', etiqueta: 'Pedidos' },
    { ruta: '/detalles-pedido', etiqueta: 'Detalles de pedido' },
    { ruta: '/materiales', etiqueta: 'Materiales' },
    { ruta: '/proveedores', etiqueta: 'Proveedores' },
    { ruta: '/compras', etiqueta: 'Compras' },
  ];

  sidebarRetraido = false;

alternarSidebar(): void {
  this.sidebarRetraido = !this.sidebarRetraido;
}
  // Función para alternar el estado del sidebar
  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
