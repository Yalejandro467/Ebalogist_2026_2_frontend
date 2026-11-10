import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CrudConfig, CrudField } from '../../models/crud-config.model';
import { CrudApiService } from '../../services/crud-api.service';

type Formulario = Record<string, string | number | boolean | null>;

@Component({
  selector: 'app-crud-page',
  imports: [FormsModule],
  templateUrl: './crud-page.html',
  styleUrl: './crud-page.css'
})
export class CrudPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(CrudApiService);

  readonly config = this.route.snapshot.data['config'] as CrudConfig;
  readonly filas = signal<Record<string, any>[]>([]);
  readonly mensaje = signal('');
  readonly esError = signal(false);
  readonly cargando = signal(false);
  readonly popupAbierto = signal(false);
  readonly modo = signal<'crear' | 'editar'>('crear');

  idFiltro = '';
  formulario: Formulario = {};
  private idEditando: number | null = null;

  ngOnInit(): void {
    this.formulario = this.formularioVacio();
    this.cargarTodos();
  }

  buscar(): void {
    const valor = String(this.idFiltro ?? '').trim();

    if (!valor) {
      this.cargarTodos();
      return;
    }

    if (!/^\d+$/.test(valor) || Number(valor) < 1) {
      this.avisar('Escribe un ID numérico válido.', true);
      return;
    }

    this.cargando.set(true);

    if (this.config.key === 'detalles-pedido') {
      this.api.listar<Record<string, any>[]>(`${this.config.basePath}/${valor}`).subscribe({
        next: (datos) => {
          this.filas.set(datos);
          this.avisar(datos.length ? '' : 'Este pedido no tiene detalles registrados.');
          this.cargando.set(false);
        },
        error: (error: HttpErrorResponse) => this.fallo(error)
      });
      return;
    }

    const ruta = this.config.key === 'usuarios'
      ? `${this.config.basePath}/${valor}`
      : `${this.config.basePath}/${valor}`;

    this.api.obtener<Record<string, any>>(ruta).subscribe({
      next: (dato) => {
        this.filas.set([dato]);
        this.avisar('');
        this.cargando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.filas.set([]);
        this.fallo(error);
      }
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

  abrirEditar(fila: Record<string, any>): void {
    this.modo.set('editar');
    this.idEditando = Number(fila['id']);
    this.formulario = {};

    for (const campo of this.config.fields) {
      let valor = fila[campo.key] ?? (campo.type === 'boolean' ? true : '');
      if (campo.type === 'date' && typeof valor === 'string') {
        valor = valor.slice(0, 10);
      }
      this.formulario[campo.key] = valor;
    }

    this.popupAbierto.set(true);
  }

  cerrarPopup(): void {
    this.popupAbierto.set(false);
  }

  guardar(): void {
    if (!this.formularioValido()) {
      this.avisar('Completa los campos obligatorios y verifica los valores.', true);
      return;
    }

    this.cargando.set(true);
    const claves = this.modo() === 'editar' && this.config.updateKeys
      ? this.config.updateKeys
      : this.config.fields.map(campo => campo.key);
    const datos = this.crearPayload(claves);

    if (this.modo() === 'crear') {
      this.api.crear<Record<string, any>>(this.config.basePath, datos).subscribe({
        next: (respuesta) => {
          if (this.config.key === 'detalles-pedido') {
            this.idFiltro = String(respuesta['pedido_id']);
          }
          this.despuesDeGuardar('Registro creado correctamente.');
        },
        error: (error: HttpErrorResponse) => this.fallo(error)
      });
      return;
    }

    if (this.idEditando === null) {
      this.avisar('No se encontró el ID del registro.', true);
      this.cargando.set(false);
      return;
    }

    this.api.actualizar<Record<string, any>>(
      `${this.config.basePath}/${this.idEditando}`,
      datos
    ).subscribe({
      next: () => this.despuesDeGuardar('Registro actualizado correctamente.'),
      error: (error: HttpErrorResponse) => this.fallo(error)
    });
  }

  eliminar(fila: Record<string, any>): void {
    const id = Number(fila['id']);
    if (!confirm(`¿Deseas eliminar el registro ${id}?`)) return;

    this.cargando.set(true);
    this.api.eliminar(`${this.config.basePath}/${id}`).subscribe({
      next: () => {
        this.avisar('Registro eliminado correctamente.');
        this.refrescar();
      },
      error: (error: HttpErrorResponse) => this.fallo(error)
    });
  }

  mostrarCampo(campo: CrudField): boolean {
    return this.modo() === 'crear' || campo.editOnUpdate !== false;
  }

  etiquetaColumna(clave: string): string {
    const nombres: Record<string, string> = {
      id: 'ID',
      cliente_id: 'ID cliente',
      producto_id: 'ID producto',
      pedido_id: 'ID pedido',
      fecha: 'Fecha',
      fecha_entrega: 'Fecha entrega',
      direccion_entrega: 'Dirección de entrega',
      valor_total: 'Valor total',
      precio_unitario: 'Precio unitario',
      subtotal: 'Subtotal',
      activo: 'Estado'
    };
    if (nombres[clave]) return nombres[clave];
    return this.config.fields.find(campo => campo.key === clave)?.label ?? clave;
  }

  valorCelda(fila: Record<string, any>, clave: string): string | number {
    const valor = fila[clave];
    if (clave === 'activo') return valor ? 'Activo' : 'Inactivo';
    if (valor === null || valor === undefined || valor === '') return '—';
    if (typeof valor === 'string' && (clave === 'fecha' || clave === 'fecha_entrega')) {
      return valor.slice(0, 10);
    }
    return valor;
  }

  private cargarTodos(): void {
    if (this.config.key === 'detalles-pedido') {
      this.filas.set([]);
      this.avisar('Escribe el ID de un pedido y pulsa Buscar para consultar sus detalles.');
      return;
    }

    this.cargando.set(true);
    this.api.listar<Record<string, any>[]>(this.config.listPath).subscribe({
      next: (datos) => {
        this.filas.set(datos);
        this.avisar(datos.length ? '' : 'No hay registros para mostrar.');
        this.cargando.set(false);
      },
      error: (error: HttpErrorResponse) => this.fallo(error)
    });
  }

  private formularioVacio(): Formulario {
    const datos: Formulario = {};
    for (const campo of this.config.fields) {
      datos[campo.key] = campo.type === 'boolean' ? true : '';
    }
    return datos;
  }

  private formularioValido(): boolean {
    return this.config.fields
      .filter(campo => this.modo() === 'crear' || campo.editOnUpdate !== false)
      .every(campo => {
        const valor = this.formulario[campo.key];
        if (campo.required && (valor === '' || valor === null || valor === undefined)) return false;
        if (campo.type === 'number' && valor !== '' && (valor === null || !Number.isFinite(Number(valor)))) return false;
        return true;
      });
  }

  private crearPayload(claves: string[]): Record<string, any> {
    const payload: Record<string, any> = {};
    for (const clave of claves) {
      const campo = this.config.fields.find(item => item.key === clave);
      const valor = this.formulario[clave];
      if (campo?.type === 'number') {
        payload[clave] = valor === '' || valor === null ? null : Number(valor);
      } else if (campo?.type === 'boolean') {
        payload[clave] = Boolean(valor);
      } else if (valor === '' && !campo?.required) {
        payload[clave] = null;
      } else {
        payload[clave] = typeof valor === 'string' ? valor.trim() : valor;
      }
    }
    return payload;
  }

  private refrescar(): void {
    const filtro = String(this.idFiltro ?? '').trim();
  
    if (this.config.key === 'detalles-pedido' && !filtro) {
      this.cargarTodos();
      return;
    }
  
    if (filtro) {
      this.buscar();
      return;
    }
  
    this.cargarTodos();
  }

  private despuesDeGuardar(texto: string): void {
    this.popupAbierto.set(false);
    this.avisar(texto);
    this.refrescar();
  }

  private fallo(error: HttpErrorResponse): void {
    this.avisar(this.textoError(error), true);
    this.cargando.set(false);
  }

  private avisar(texto: string, error = false): void {
    this.mensaje.set(texto);
    this.esError.set(error && texto.length > 0);
  }

  private textoError(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'No se pudo conectar con la API. Verifica que FastAPI esté funcionando en el puerto 8000.';
    }
    if (error.status === 404) return 'No se encontró el registro solicitado.';
    if (error.status === 409) return 'No se puede realizar la operación porque el registro está relacionado con otros datos.';
    if (error.status === 422) {
      const detalle = error.error?.detail;
      if (Array.isArray(detalle)) {
        return detalle.map(item => `${item.loc?.join('.')}: ${item.msg}`).join(' | ');
      }
      if (typeof detalle === 'string') return detalle;
      return 'La API rechazó los datos. Revisa los campos obligatorios.';
    }
    return typeof error.error?.detail === 'string'
      ? error.error.detail
      : 'Ocurrió un error al comunicarse con la API.';
  }
}
