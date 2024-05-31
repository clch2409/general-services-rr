import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EncargadoSalon } from '../models/encargado.salon.model'; 

@Injectable({
  providedIn: 'root'
})
export class EncargadoSalonService {

  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  createEncargado(encargadoData: any): Observable<EncargadoSalon> {
    return this.http.post<EncargadoSalon>(`${this.baseUrl}/encargados`, encargadoData);
  }

  getEncargadoById(encargadoId: number): Observable<EncargadoSalon> {
    return this.http.get<EncargadoSalon>(`${this.baseUrl}/encargados/${encargadoId}`);
  }

  getEncargadoByDni(dni: string): Observable<EncargadoSalon> {
    return this.http.get<EncargadoSalon>(`${this.baseUrl}/encargados/dni/${dni}`);
  }

  updateEncargado(encargadoId: number, encargadoData: any): Observable<EncargadoSalon> {
    return this.http.put<EncargadoSalon>(`${this.baseUrl}/encargados/${encargadoId}`, encargadoData);
  }

  deleteEncargado(encargadoId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/encargados/${encargadoId}`);
  }
}
