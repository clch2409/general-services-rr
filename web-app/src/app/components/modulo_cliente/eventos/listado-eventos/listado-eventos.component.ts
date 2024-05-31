import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Evento } from '../../../models/evento.model';
import { EventoService } from '../../../services/evento.service';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-listado-eventos',
  templateUrl: './listado-eventos.component.html',
  styleUrls: ['./listado-eventos.component.css']
})
export class ListadoEventosComponent implements OnInit {
  eventos: Evento[] = [];
  filteredEventos: Evento[] = [];
  searchId = '';

  constructor(private eventoService: EventoService, private storageService: StorageService) { }

  ngOnInit(): void {
    this.storageService.comprobarSesion();
    this.obtenerEventos();
  }

  obtenerEventos() {
    this.eventoService.obtenerEventos().subscribe(
      (data: Evento[]) => {
        this.eventos = data;
        this.filteredEventos = data;
      },
      (error: HttpErrorResponse) => {
        console.error('Error al obtener la lista de eventos:', error);
        if (error.status === 401) {
          Swal.fire('Sesión Caducada', 'Su sesión ha caducado. Inicie sesión de nuevo, por favor.');
          this.cerrarSesion();
        }
      }
    );
  }

  buscarEventoPorId() {
    if (this.searchId !== '') {
      this.eventoService.obtenerEventoPorId(Number(this.searchId)).subscribe(
        (data: Evento) => {
          this.filteredEventos = [data];
        },
        (error: HttpErrorResponse) => {
          console.error('Error al buscar evento por ID:', error);
        }
      );
    } else {
      this.filteredEventos = this.eventos;
    }
  }

  agregarServiciosAlEvento(eventoId: number, servicios: number[]) {
    this.eventoService.agregarServiciosAlEvento(eventoId, servicios).subscribe(
      (data: Evento) => {
        console.log('Servicios agregados con éxito:', data);
      },
      (error: HttpErrorResponse) => {
        console.error('Error al agregar servicios:', error);
      }
    );
  }

  obtenerPrecioEvento(eventoId: number) {
    this.eventoService.obtenerPrecioEvento(eventoId).subscribe(
      (data: any) => {
        console.log('Tarifa de evento:', data);
      },
      (error: HttpErrorResponse) => {
        console.error('Error al obtener tarifa de evento:', error);
      }
    );
  }

  resetearFiltros() {
    this.searchId = '';
    this.filteredEventos = this.eventos;
  }
  
  cerrarSesion() {
    this.storageService.cerrarSesion();
    this.storageService.comprobarSesion();
  }
}