import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rol } from '../models/rol.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private baseUrl = 'http://localhost:3000/api/v1/roles';

  constructor(private http: HttpClient, private storageService: StorageService) { }

  obtenerRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.baseUrl, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  crearRol(rol: Rol): Observable<Rol> {
    return this.http.post<Rol>(this.baseUrl, rol, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  obtenerRolPorId(id: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.baseUrl}/${id}`, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  actualizarRol(id: number, cambios: Partial<Rol>): Observable<Rol> {
    return this.http.put<Rol>(`${this.baseUrl}/${id}`, cambios, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }
}
