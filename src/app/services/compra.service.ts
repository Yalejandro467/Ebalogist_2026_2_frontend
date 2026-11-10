import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Compra, CompraCreate, CompraUpdate } from '../models/compra.model';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/compras`;

  listar(): Observable<Compra[]> {
    return this.http.get<Compra[]>(`${this.base}/`);
  }

  obtener(id: string): Observable<Compra> {
    return this.http.get<Compra>(`${this.base}/${id}`);
  }

  crear(datos: CompraCreate): Observable<Compra> {
    return this.http.post<Compra>(`${this.base}/`, datos);
  }

  actualizar(id: string, datos: CompraUpdate): Observable<Compra> {
    return this.http.put<Compra>(`${this.base}/${id}`, datos);
  }

  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}