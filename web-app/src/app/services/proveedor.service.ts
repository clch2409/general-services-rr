import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proveedor } from '../models/proveedor.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private baseUrl = 'http://localhost:3000/api/v1/proveedores';

  constructor(private http: HttpClient, private storageService: StorageService) { }

  obtenerProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.baseUrl, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  crearProveedor(proveedor: Proveedor): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.baseUrl, proveedor, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  obtenerProveedorPorId(id: number): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.baseUrl}/${id}`, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  actualizarProveedor(id: number, cambios: Partial<Proveedor>): Observable<Proveedor> {
    return this.http.patch<Proveedor>(`${this.baseUrl}/${id}`, cambios, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  eliminarProveedor(id: number): Observable<Proveedor> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

}
