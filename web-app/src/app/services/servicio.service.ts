import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicio } from '../models/servicio.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private baseUrl = 'http://localhost:3000/api/v1/servicios';

  constructor(private http: HttpClient, private storageService: StorageService) { }

  obtenerServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.baseUrl, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  crearServicio(servicio: Servicio): Observable<Servicio> {
    return this.http.post<Servicio>(this.baseUrl, servicio, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  obtenerServicioPorId(id: number): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.baseUrl}/${id}`, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  actualizarServicio(id: number, cambios: Partial<Servicio>): Observable<Servicio> {
    return this.http.patch<Servicio>(`${this.baseUrl}/${id}`, cambios, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }
}
