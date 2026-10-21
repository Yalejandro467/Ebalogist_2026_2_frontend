
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  Usuario,
  UsuarioCreate,
  UsuarioUpdate
} from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/usuarios`;

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.base}/`);
  }

  obtener(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.base}/${id}`);
  }

  crear(datos: UsuarioCreate): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.base}/`, datos);
  }

  actualizar(
    id: number,
    datos: UsuarioUpdate
  ): Observable<Usuario> {
    return this.http.put<Usuario>(
      `${this.base}/${id}`,
      datos
    );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
