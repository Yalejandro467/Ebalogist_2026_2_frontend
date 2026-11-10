import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Material, MaterialCreate, MaterialUpdate } from '../models/material.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/materiales`; // Ajusta el endpoint según tu backend

  listar(): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.base}/`);
  }

  obtener(id: string): Observable<Material> {
    return this.http.get<Material>(`${this.base}/${id}`);
  }

  crear(datos: MaterialCreate): Observable<Material> {
    return this.http.post<Material>(`${this.base}/`, datos);
  }

  actualizar(id: string, datos: MaterialUpdate): Observable<Material> {
    return this.http.put<Material>(`${this.base}/${id}`, datos);
  }

  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}