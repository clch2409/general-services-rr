import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EncargadoSalon } from '../models/encargadoSalon.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class EncargadoSalonService {
  private baseUrl = 'http://localhost:3000/api/v1/encargados';


  constructor(private http: HttpClient, private storageService: StorageService) {

  }

  obtenerEncargadosSalon(): Observable<EncargadoSalon[]> {
    return this.http.get<EncargadoSalon[]>(this.baseUrl, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  obtenerEncargadosSalonActivos(): Observable<EncargadoSalon[]> {
    return this.http.get<EncargadoSalon[]>(`${this.baseUrl}/activos`, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  crearEncargadoSalon(encargadoSalon: EncargadoSalon): Observable<EncargadoSalon> {
    return this.http.post<EncargadoSalon>(this.baseUrl, encargadoSalon, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  obtenerEncargadoSalonPorId(id: number): Observable<EncargadoSalon> {
    return this.http.get<EncargadoSalon>(`${this.baseUrl}/${id}`, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  obtenerEncargadoSalonPorDni(dni: string): Observable<EncargadoSalon> {
    return this.http.get<EncargadoSalon>(`${this.baseUrl}/dni/${dni}`, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  obtenerEncargadoSalonPorEmail(email: string): Observable<EncargadoSalon> {
    return this.http.get<EncargadoSalon>(`${this.baseUrl}/email/${email}`, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  actualizarEncargadoSalon(id: number, cambios: Partial<EncargadoSalon>): Observable<EncargadoSalon> {
    return this.http.patch<EncargadoSalon>(`${this.baseUrl}/${id}`, cambios, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  eliminarEncargadoSalon(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  //checkDniAndHiringDate

  //checkExistenceByDni

  //validateHiringDate
}
