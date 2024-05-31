import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../models/evento.model';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private baseUrl = 'http://localhost:3000/api/v1/eventos';

  constructor(private http: HttpClient) { }

  obtenerEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.baseUrl);
  }

  crearEvento(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.baseUrl, evento);
  }
  
  obtenerEventoPorId(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.baseUrl}/${id}`);
  }

  actualizarEvento(id: number, cambios: Partial<Evento>): Observable<Evento> {
    return this.http.put<Evento>(`${this.baseUrl}/${id}`, cambios);
  }

  cancelarEvento(id: number): Observable<Evento> {
    return this.http.put<Evento>(`${this.baseUrl}/${id}/cancelar`, {});
  }

  obtenerEventosDeHoy(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/today`);
  }

  obtenerEventosDeAyer(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.baseUrl}/yesterday`);
  }

  makeCotizacion(cotizacion: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/cotizacion`, cotizacion);
  }

  agregarColaboradoresAlEvento(id: number, colaboradores: number[]): Observable<Evento> {
    return this.http.put<Evento>(`${this.baseUrl}/add/colaboradores/${id}`, colaboradores);
  }

  agregarServiciosAlEvento(id: number, servicios: number[]): Observable<Evento> {
    return this.http.put<Evento>(`${this.baseUrl}/add/servicios/${id}`, servicios);
  }

  obtenerPrecioEvento(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/price/event/${id}`);
  }

  buscarEventoPorId(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.baseUrl}/${id}`);
  }
}