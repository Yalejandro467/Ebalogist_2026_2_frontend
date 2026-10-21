
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Usuario,
  UsuarioCreate,
  UsuarioUpdate
} from '../../models/usuario.model';

import { UsuarioService } from '../../services/usuario.service';

type ModoPopup = 'crear' | 'editar';

@Component({
  selector: 'app-usuarios',
  imports: [FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit {
  private readonly usuarioService = inject(UsuarioService);

  readonly filas = signal<Usuario[]>([]);
  readonly mensaje = signal('');
  readonly esError = signal(false);
  readonly cargando = signal(false);
  readonly popupAbierto = signal(false);
  readonly modo = signal<ModoPopup>('crear');

  idFiltro = '';
  formulario: UsuarioCreate = this.formularioVacio();
  private idEditando: number | null = null;

  ngOnInit(): void {
    this.cargarTodos();
  }

  buscarPorId(): void {
    const id = this.idFiltro.trim();

    if (!id) {
      this.cargarTodos();
      return;
    }

    this.cargando.set(true);

    this.usuarioService.obtener(Number(id)).subscribe({
      next: (usuario) => {
        this.filas.set([usuario]);
        this.avisar('');
        this.cargando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.filas.set([]);
        this.avisar(this.textoError(error), true);
        this.cargando.set(false);
      },
    });
  }

  limpiarFiltro(): void {
    this.idFiltro = '';
    this.cargarTodos();
  }

  abrirCrear(): void {
    this.modo.set('crear');
    this.idEditando = null;
    this.formulario = this.formularioVacio();
    this.popupAbierto.set(true);
  }

  abrirEditar(fila: Usuario): void {
    this.modo.set('editar');
    this.idEditando = fila.id;

    this.formulario = {
      nombre: fila.nombre,
      correo: fila.correo,
      activo: fila.activo,
    };

    this.popupAbierto.set(true);
  }

  cerrarPopup(): void {
    this.popupAbierto.set(false);
  }

  guardar(): void {
    if (!this.formularioValido()) {
      this.avisar('Completa el nombre y el correo electrónico.', true);
      return;
    }

    this.cargando.set(true);

    if (this.modo() === 'crear') {
      this.usuarioService.crear(this.formulario).subscribe({
        next: () => this.despuesDeGuardar('Usuario creado correctamente'),
        error: (error: HttpErrorResponse) => this.falloGuardar(error),
      });
      return;
    }

    if (this.idEditando === null) {
      this.avisar('No se encontró el ID del usuario que deseas editar.', true);
      this.cargando.set(false);
      return;
    }

    this.usuarioService.actualizar(
      this.idEditando,
      this.datosEdicion()
    ).subscribe({
      next: () => this.despuesDeGuardar('Usuario actualizado correctamente'),
      error: (error: HttpErrorResponse) => this.falloGuardar(error),
    });
  }

  eliminar(fila: Usuario): void {
    const confirmar = confirm(`¿Deseas eliminar al usuario ${fila.nombre}?`);

    if (!confirmar) {
      return;
    }

    this.cargando.set(true);

    this.usuarioService.eliminar(fila.id).subscribe({
      next: () => {
        this.avisar('Usuario eliminado correctamente');
        this.refrescar();
      },
      error: (error: HttpErrorResponse) => {
        this.avisar(this.textoError(error), true);
        this.cargando.set(false);
      },
    });
  }

  private cargarTodos(): void {
    this.cargando.set(true);

    this.usuarioService.listar().subscribe({
      next: (respuesta) => {
        this.filas.set(respuesta);
        this.avisar(respuesta.length ? '' : 'No hay registros');
        this.cargando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.filas.set([]);
        const listaVacia = error.status === 404;

        this.avisar(
          listaVacia ? 'No hay registros' : this.textoError(error),
          !listaVacia
        );

        this.cargando.set(false);
      },
    });
  }

  private refrescar(): void {
    if (this.idFiltro.trim()) {
      this.buscarPorId();
      return;
    }

    this.cargarTodos();
  }

  private despuesDeGuardar(texto: string): void {
    this.popupAbierto.set(false);
    this.avisar(texto);
    this.refrescar();
  }

  private falloGuardar(error: HttpErrorResponse): void {
    this.avisar(this.textoError(error), true);
    this.cargando.set(false);
  }

  private formularioValido(): boolean {
    return Boolean(
      this.formulario.nombre.trim() &&
      this.formulario.correo.trim()
    );
  }

  private datosEdicion(): UsuarioUpdate {
    return {
      nombre: this.formulario.nombre.trim(),
      correo: this.formulario.correo.trim(),
      activo: this.formulario.activo,
    };
  }

  private formularioVacio(): UsuarioCreate {
    return {
      nombre: '',
      correo: '',
      activo: true,
    };
  }

  private avisar(texto: string, error = false): void {
    this.mensaje.set(texto);
    this.esError.set(error && texto.length > 0);
  }

  private textoError(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'No se pudo conectar con la API. Verifica que el backend esté funcionando en el puerto 8000.';
    }

    if (error.status === 404) {
      return 'No se encontró el registro solicitado.';
    }

    if (error.status === 409) {
      return 'El registro entra en conflicto con otro existente.';
    }

    if (error.status === 422) {
      return 'Los datos enviados no son válidos. Revisa los campos y el ID.';
    }

    const detail = error.error?.detail;

    if (typeof detail === 'string') {
      return detail;
    }

    return 'No se pudo completar la operación.';
  }
}
