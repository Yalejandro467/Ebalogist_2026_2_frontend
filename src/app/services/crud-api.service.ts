import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CrudApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  listar<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${path}`);
  }

  obtener<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${path}`);
  }

  crear<T>(path: string, datos: unknown): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${path}`, datos);
  }

  actualizar<T>(path: string, datos: unknown): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${path}`, datos);
  }

  eliminar(path: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${path}`);
  }
}
