import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoBuffet } from '../models/tipoBuffet.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TipoBuffetService {
  private baseUrl = 'http://localhost:3000/api/v1/buffets';

  constructor(private http: HttpClient, private storageService: StorageService) { }

  obtenerTipoBuffet(): Observable<TipoBuffet[]> {
    return this.http.get<TipoBuffet[]>(this.baseUrl, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  crearTipoBuffet(tipoBuffet: TipoBuffet): Observable<TipoBuffet> {
    return this.http.post<TipoBuffet>(this.baseUrl, tipoBuffet, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  obtenerTipoBuffetPorId(id: number): Observable<TipoBuffet> {
    return this.http.get<TipoBuffet>(`${this.baseUrl}/${id}`, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  actualizarTipoBuffet(id: number, cambios: Partial<TipoBuffet>): Observable<TipoBuffet> {
    return this.http.patch<TipoBuffet>(`${this.baseUrl}/${id}`, cambios, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }
}
