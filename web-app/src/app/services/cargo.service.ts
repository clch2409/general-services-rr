import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cargo } from '../models/cargo.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CargoService {
  private baseUrl = 'http://localhost:3000/api/v1/cargos';
  constructor(private http: HttpClient, private storageService: StorageService) { }

  obtenerCargos(): Observable<Cargo[]> {
    return this.http.get<Cargo[]>(this.baseUrl, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  crearCargo(cargo: Cargo): Observable<Cargo> {
    return this.http.post<Cargo>(this.baseUrl, cargo, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  obtenerCargoPorId(id: number): Observable<Cargo> {
    return this.http.get<Cargo>(`${this.baseUrl}/${id}`, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  actualizarCargo(id: number, cambios: Partial<Cargo>): Observable<Cargo> {
    return this.http.patch<Cargo>(`${this.baseUrl}/${id}`, cambios, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }
}
