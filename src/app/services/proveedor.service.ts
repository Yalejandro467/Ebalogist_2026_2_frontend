
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Proveedor,
  ProveedorCreate,
  ProveedorUpdate,
  ProveedorResponse
} from '../models/proveedor.model';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/proveedores`;

  listar(): Observable<ProveedorResponse<Proveedor[]>> {
    return this.http.get<ProveedorResponse<Proveedor[]>>(`${this.base}/`);
  }

  obtener(id: string): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.base}/${id}`);
  }

  crear(datos: ProveedorCreate): Observable<ProveedorResponse<Proveedor>> {
    return this.http.post<ProveedorResponse<Proveedor>>(`${this.base}/`, datos);
  }

  actualizar(id: string, datos: ProveedorUpdate): Observable<ProveedorResponse<Proveedor>> {
    return this.http.put<ProveedorResponse<Proveedor>>(`${this.base}/${id}`, datos);
  }

  eliminar(id: string): Observable<{ status: number; message: string }> {
    return this.http.delete<{ status: number; message: string }>(`${this.base}/${id}`);
  }
}
