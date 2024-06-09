import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../models/evento.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private baseUrl = 'http://localhost:3000/api/v1/eventos';

  constructor(private http: HttpClient, private storageService: StorageService) { }

  obtenerEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.baseUrl, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  crearEvento(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.baseUrl, evento, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  obtenerEventoPorId(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.baseUrl}/${id}`, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  actualizarEvento(id: number, cambios: Partial<Evento>): Observable<Evento> {
    return this.http.put<Evento>(`${this.baseUrl}/${id}`, cambios, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  cancelarEvento(id: number): Observable<Evento> {
    return this.http.put<Evento>(`${this.baseUrl}/${id}/cancelar`, {}, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  obtenerEventosDeHoy(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/today`, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  obtenerEventosDeAyer(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/yesterday`, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  makeCotizacion(cotizacion: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/cotizacion`, cotizacion, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  agregarColaboradoresAlEvento(id: number, colaboradores: number[]): Observable<Evento> {
    return this.http.put<Evento>(`${this.baseUrl}/add/colaboradores/${id}`, colaboradores, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  agregarServiciosAlEvento(id: number, servicios: number[]): Observable<Evento> {
    return this.http.put<Evento>(`${this.baseUrl}/add/servicios`, {servicios, eventoId: id}, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  obtenerPrecioEvento(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/price/event/${id}`, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  buscarEventoPorId(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.baseUrl}/${id}`, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }
}
