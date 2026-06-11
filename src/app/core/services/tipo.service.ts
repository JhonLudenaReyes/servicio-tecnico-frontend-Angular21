import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tipo } from '../models/tipo.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TipoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tipos`;

  _tipos = signal<Tipo[]>([]);

  get tipos() {
    return this._tipos;
  }

  getAll(): Observable<Tipo[]> {
    return this.http.get<Tipo[]>(`${this.apiUrl}/all`);
  }

  getById(id: number): Observable<Tipo> {
    return this.http.get<Tipo>(`${this.apiUrl}/${id}`);
  }

  save(tipo: Tipo): Observable<Tipo> {
    return this.http.post<Tipo>(`${this.apiUrl}/save`, tipo);
  }

  update(id: number, tipo: Tipo): Observable<Tipo> {
    return this.http.put<Tipo>(`${this.apiUrl}/update/${id}`, tipo);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
