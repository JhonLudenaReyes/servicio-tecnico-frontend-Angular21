import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipo } from '../models/equipo.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquipoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/equipos`;

  getAll(): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(`${this.apiUrl}/all`);
  }

  getById(id: number): Observable<Equipo> {
    return this.http.get<Equipo>(`${this.apiUrl}/${id}`);
  }

  save(equipo: Equipo): Observable<Equipo> {
    return this.http.post<Equipo>(`${this.apiUrl}/save`, equipo);
  }

  update(id: number, equipo: Equipo): Observable<Equipo> {
    return this.http.put<Equipo>(`${this.apiUrl}/update/${id}`, equipo);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
