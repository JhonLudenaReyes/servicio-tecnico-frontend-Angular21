import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ciudad } from '../models/ciudad.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CiudadService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/ciudades`;

  _ciudades = signal<Ciudad[]>([]);

  get ciudades() {
    return this._ciudades;
  }

  getAll(): Observable<Ciudad[]> {
    return this.http.get<Ciudad[]>(`${this.apiUrl}/all`);
  }

  getById(id: number): Observable<Ciudad> {
    return this.http.get<Ciudad>(`${this.apiUrl}/${id}`);
  }

  save(ciudad: Ciudad): Observable<Ciudad> {
    return this.http.post<Ciudad>(`${this.apiUrl}/save`, ciudad);
  }

  update(id: number, ciudad: Ciudad): Observable<Ciudad> {
    return this.http.put<Ciudad>(`${this.apiUrl}/update/${id}`, ciudad);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
