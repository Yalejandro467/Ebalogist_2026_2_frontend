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
  private idEditando: string | null = null;

  ngOnInit(): void {
    if (!this.config) {
      this.avisar('Esta sección no tiene configuración (revisa crud-configs.ts).', true);
      return;
    }
    this.formulario = this.formularioVacio();
    this.cargarTodos();
  }

  /** Devuelve el id de una fila según la entidad (id, id_material, id_proveedor, id_compra...). */
  idDe(fila: Record<string, any>): string {
    const valor = fila[this.config.idKey ?? 'id'];
    return valor === null || valor === undefined ? '' : String(valor);
  }

  buscar(): void {
    const valor = String(this.idFiltro ?? '').trim();

    if (!valor) {
      this.cargarTodos();
      return;
    }

    // Las entidades de la plantilla usan ids numéricos; las del backend E-Balogist usan UUID (texto).
    if (!this.config.idKey && (!/^\d+$/.test(valor) || Number(valor) < 1)) {
      this.avisar('Escribe un ID numérico válido.', true);
      return;
    }

    this.cargando.set(true);

    if (this.config.key === 'detalles-pedido') {
      this.api.listar<any>(`${this.config.basePath}/${valor}`).subscribe({
        next: (respuesta) => {
          const datos = this.extraerLista(respuesta);
          this.filas.set(datos);
          this.avisar(datos.length ? '' : 'Este pedido no tiene detalles registrados.');
          this.cargando.set(false);
        },
        error: (error: HttpErrorResponse) => this.fallo(error)
      });
      return;
    }

    this.api.obtener<any>(`${this.config.basePath}/${encodeURIComponent(valor)}`).subscribe({
      next: (respuesta) => {
        const dato = this.extraerUno(respuesta);
        this.filas.set(dato ? [dato] : []);
        this.avisar(dato ? '' : 'No se encontró el registro solicitado.');
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
    this.idEditando = this.idDe(fila) || null;
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
      // listPath lleva la barra final (/materiales/), así FastAPI no responde con una redirección 307
      this.api.crear<any>(this.config.listPath, datos).subscribe({
        next: (respuesta) => {
          if (this.config.key === 'detalles-pedido') {
            this.idFiltro = String(this.extraerUno(respuesta)?.['pedido_id'] ?? '');
          }
          this.despuesDeGuardar('Registro creado correctamente.');
        },
        error: (error: HttpErrorResponse) => this.fallo(error)
      });
      return;
    }

    if (!this.idEditando) {
      this.avisar('No se encontró el ID del registro.', true);
      this.cargando.set(false);
      return;
    }

    this.api.actualizar<any>(
      `${this.config.basePath}/${encodeURIComponent(this.idEditando)}`,
      datos
    ).subscribe({
      next: () => this.despuesDeGuardar('Registro actualizado correctamente.'),
      error: (error: HttpErrorResponse) => this.fallo(error)
    });
  }

  eliminar(fila: Record<string, any>): void {
    const id = this.idDe(fila);
    if (!id) {
      this.avisar('No se encontró el ID del registro.', true);
      return;
    }
    const nombre = fila['nombre'] ? `"${fila['nombre']}"` : id;
    if (!confirm(`¿Deseas eliminar el registro ${nombre}?`)) return;

    this.cargando.set(true);
    this.api.eliminar(`${this.config.basePath}/${encodeURIComponent(id)}`).subscribe({
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
      id_material: 'ID',
      id_proveedor: this.config.key === 'proveedores' ? 'ID' : 'ID proveedor',
      id_compra: 'ID',
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
    this.api.listar<any>(this.config.listPath).subscribe({
      next: (respuesta) => {
        const datos = this.extraerLista(respuesta);
        this.filas.set(datos);
        this.avisar(datos.length ? '' : 'No hay registros para mostrar.');
        this.cargando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        // El backend responde 404 cuando la tabla está vacía: se muestra como lista vacía
        if (error.status === 404) {
          this.filas.set([]);
          this.avisar('No hay registros para mostrar.');
          this.cargando.set(false);
          return;
        }
        this.fallo(error);
      }
    });
  }

  /** Acepta tanto un arreglo [...] como la respuesta del backend { data: [...] }. */
  private extraerLista(respuesta: any): Record<string, any>[] {
    if (Array.isArray(respuesta)) return respuesta;
    if (Array.isArray(respuesta?.data)) return respuesta.data;
    return [];
  }

  /** Acepta tanto un objeto {...} como la respuesta del backend { data: {...} }. */
  private extraerUno(respuesta: any): Record<string, any> | null {
    if (!respuesta || typeof respuesta !== 'object') return null;
    if (respuesta.data && typeof respuesta.data === 'object' && !Array.isArray(respuesta.data)) {
      return respuesta.data;
    }
    return respuesta;
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
    if (error.status === 404) {
      return typeof error.error?.detail === 'string' ? error.error.detail : 'No se encontró el registro solicitado.';
    }
    if (error.status === 409) return 'No se puede realizar la operación porque el registro está relacionado con otros datos.';
    if (error.status === 422) {
      const detalle = error.error?.detail;
      if (Array.isArray(detalle)) {
        return detalle.map(item => `${item.loc?.join('.')}: ${item.msg}`).join(' | ');
      }
      if (typeof detalle === 'string') return detalle;
      return 'La API rechazó los datos. Revisa los campos obligatorios.';
    }
    if (error.status >= 500) {
      return 'Error interno del servidor. Revisa la consola donde corre FastAPI.';
    }
    return typeof error.error?.detail === 'string'
      ? error.error.detail
      : 'Ocurrió un error al comunicarse con la API.';
  }
}
