import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoEvento } from '../models/tipoEvento.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TipoEventoService {
  private baseUrl = 'http://localhost:3000/api/v1/tipoevento';

  constructor(private http: HttpClient, private storageService: StorageService) { }

  obtenerTipoEventos(): Observable<TipoEvento[]> {
    return this.http.get<TipoEvento[]>(this.baseUrl, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  crearTipoEvento(tipoEvento: TipoEvento): Observable<TipoEvento> {
    return this.http.post<TipoEvento>(this.baseUrl, tipoEvento, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  obtenerTipoEventoPorId(id: number): Observable<TipoEvento> {
    return this.http.get<TipoEvento>(`${this.baseUrl}/${id}`, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  actualizarTipoEvento(id: number, cambios: Partial<TipoEvento>): Observable<TipoEvento> {
    return this.http.patch<TipoEvento>(`${this.baseUrl}/${id}`, cambios, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }
}
