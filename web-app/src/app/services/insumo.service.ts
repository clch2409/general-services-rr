import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Insumo } from '../models/insumo.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class InsumoService {
  private baseUrl = 'http://localhost:3000/api/v1/insumos';

  constructor(private http: HttpClient, private storageService: StorageService) { }

  obtenerInsumos(): Observable<Insumo[]> {
    return this.http.get<Insumo[]>(this.baseUrl, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  crearInsumo(insumo: Insumo): Observable<Insumo> {
    return this.http.post<Insumo>(this.baseUrl, insumo, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  obtenerInsumoPorId(id: number): Observable<Insumo> {
    return this.http.get<Insumo>(`${this.baseUrl}/${id}`, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  actualizarInsumo(id: number, cambios: Partial<Insumo>): Observable<Insumo> {
    return this.http.patch<Insumo>(`${this.baseUrl}/${id}`, cambios, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  eliminarInsumo(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }
}
