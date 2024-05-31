import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Colaborador } from '../models/colaborador.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ColaboradorService {
  private baseUrl = 'http://localhost:3000/api/v1/colaboradores';

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) { }

  obtenerColaboradores(): Observable<Colaborador[]> {
    return this.http.get<Colaborador[]>(this.baseUrl, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  crearColaborador(colaborador: Colaborador): Observable<Colaborador> {
    return this.http.post<Colaborador>(this.baseUrl, colaborador, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  obtenerColaboradorPorId(id: number): Observable<Colaborador> {
    return this.http.get<Colaborador>(`${this.baseUrl}/${id}`, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  obtenerColaboradorPorDni(dni: string): Observable<Colaborador> {
    return this.http.get<Colaborador>(`${this.baseUrl}/dni/${dni}`, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  actualizarColaborador(id: number, cambios: Partial<Colaborador>): Observable<Colaborador> {
    return this.http.patch<Colaborador>(`${this.baseUrl}/${id}`, cambios, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  eliminarColaborador(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }
}
