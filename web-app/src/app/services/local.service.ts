import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Local } from '../models/local.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class LocalService {
  private baseUrl = 'http://localhost:3000/api/v1/locales';

  constructor(private http: HttpClient, private storageService: StorageService) { }

  obtenerLocales(): Observable<Local[]> {
    return this.http.get<Local[]>(this.baseUrl, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  obtenerLocalesActivos(): Observable<Local[]> {
    return this.http.get<Local[]>(`${this.baseUrl}/activos`, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  crearLocal(local: Local): Observable<Local> {
    return this.http.post<Local>(this.baseUrl, local, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  obtenerLocalPorId(id: number): Observable<Local> {
    return this.http.get<Local>(`${this.baseUrl}/${id}`, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  actualizarLocal(id: number, cambios: Partial<Local>): Observable<Local> {
    return this.http.patch<Local>(`${this.baseUrl}/${id}`, cambios, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  eliminarLocal(id: number): Observable<Local> {
    return this.http.delete<Local>(`${this.baseUrl}/${id}`, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  agregarPrecioAlLocal(id: number, precio: any): Observable<Local> {
    return this.http.post<Local>(`${this.baseUrl}/add/prices/${id}`, precio, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  agregarTodosLosPreciosAlLocal(id: number, precios: any[]): Observable<Local> {
    return this.http.post<Local>(`${this.baseUrl}/add/all/prices/`, {dias: [1,2,3,4,5,6,7], idLocal: id, precios: precios}, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  modificarPrecioDelLocal(id: number, diaId: number, precio: number): Observable<Local> {
    return this.http.put<Local>(`${this.baseUrl}/modificar-price/${id}/${diaId}`, { precio }, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  obtenerPrecioPorDia(id: number, diaId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/obtener-price/${id}/${diaId}`, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  agregarInsumoAlLocal(idLocal: number, idInsumo: number, cantidad: number): Observable<Local> {
    return this.http.post<Local>(`${this.baseUrl}/add/insumos`, { idLocal, idInsumo, cantidad }, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  retirarInsumosDelLocal(idLocal: number, idInsumo: number, cantidad: number): Observable<Local> {
    return this.http.post<Local>(`${this.baseUrl}/retire/insumos`, { idLocal, idInsumo, cantidad }, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  moverInsumosAOtroLocal(idOldLocal: number, idNewLocal: number, idInsumo: number, cantidad: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/move/insumos`, { idOldLocal, idNewLocal, idInsumo, cantidad }, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }
}
