import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private baseUrl = 'http://localhost:3000/api/v1/clientes';

  constructor(private http: HttpClient, private storageService: StorageService) {

  }

  obtenerClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.baseUrl, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  obtenerClientesActivos(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.baseUrl}/activos`, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  crearCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.baseUrl, cliente, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  obtenerClientePorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.baseUrl}/${id}`, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  obtenerClientePorDni(dni: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.baseUrl}/dni/${dni}`, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  obtenerClientePorEmail(email: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.baseUrl}/email/${email}`, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  actualizarCliente(id: number, cambios: Partial<Cliente>): Observable<Cliente> {
    return this.http.patch<Cliente>(`${this.baseUrl}/${id}`, cambios, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  // eliminarCliente(id: number): Observable<any> {
  //   return this.http.delete<any>(`${this.baseUrl}/${id}`);
  // }

}
