import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { EventoService } from '../../../../services/evento.service';
import { StorageService } from '../../../../services/storage.service';
import { Evento } from '../../../../models/evento.model';


@Component({
  selector: 'app-listado-eventos',
  templateUrl: './listado-eventos.component.html',
  styleUrls: ['./listado-eventos.component.css']
})
export class ListadoEventosComponent implements OnInit {
  eventos: Evento[] = [];
  filteredEventos: Evento[] = [];
  page: number = 1;
  pageSize: number = 5;
  totalEventos: number = 0;
  typeFilter: String = 'todos';
  searchId = '';

  constructor(private eventoService: EventoService, private storageService: StorageService) {}

  ngOnInit(): void {
    this.obtenerEventos();
  }

  ngAfterViewInit(): void{
    this.storageService.comprobarSesion();
  }

  ngOnChanges(): void{
    this.storageService.comprobarSesion();
  }

  obtenerEventos() {
    this.eventoService.obtenerEventos().subscribe(
      (data: Evento[]) => {
        this.eventos = data;
        this.filteredEventos = this.getEventos(this.page, this.pageSize);
        this.totalEventos = this.getTotalEventos()
        this.mostrarActivos()
      },
      (error) => {
        console.error('Error al obtener la lista de eventos:', error);
        if(error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha caducada. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    );
  }

  resetearPaginacion(){
    this.page = 1;
    this.pageSize = 5;
  }

  mostrarTodos(){
    this.resetearPaginacion()
    this.typeFilter = 'todos';
    this.filteredEventos = this.getEventos(this.page, this.pageSize);
    this.totalEventos = this.getTotalEventos();
  }

  mostrarActivos(){
    this.resetearPaginacion()
    this.typeFilter = 'activos';
    this.filteredEventos = this.getEventos(this.page, this.pageSize);
    this.totalEventos = this.getTotalEventos();
  }

  buscarEventos() {
    this.resetearPaginacion();
    this.typeFilter = 'filtrados';
    this.filteredEventos = this.getEventos(this.page, this.pageSize);
  }

  filtrarActivos(){
    return this.eventos.filter(evento => evento.status === 'activo');;
  }

  filtrarEventos(): Evento[] {
    return this.eventos.filter((evento) => {
      const idMatch = evento.id && evento.id.toString().includes(this.searchId);
      return idMatch;
    });
  }

  validarEliminacion(evento: Evento){
    const nombreEvento = `${evento.id}`
    Swal.fire({
      title: 'Eliminar Evento',
      html: '¿Desea eliminar a: <b>' + nombreEvento + '</b>?',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      icon: 'question'
    })
   .then(data => {
      if (data.isConfirmed){
        this.eliminarEvento(evento.id || 0)
      }
    })
  }

  eliminarEvento(id: number) {
    this.eventoService.cancelarEvento(id).subscribe(
      (response: Evento) => {
        console.log('Evento eliminado correctamente:', response);
        const nombreEvento = `${response.id}`
        Swal.fire('Evento Eliminado', 'El evento: <b>' + nombreEvento + '</b> ha sido eliminado correctamente', 'success')
       .then(data => {
          this.obtenerEventos()
        })
      },
      (error) => {
        console.error('Error al eliminar el evento:', error);
      }
    );
  }

  resetearFiltros() {
    this.searchId = '';
    this.filteredEventos = this.eventos;
  }

  getEventos(page: number, pageSize: number): Evento[] {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    if (this.typeFilter === 'todos'){
      return this.eventos.slice(start, end);
    }
    else if (this.typeFilter === 'filtrados'){
      return this.filtrarEventos().slice(start, end);
    }
    else{
      return this.filtrarActivos().slice(start, end);
    }
  }

  nextPage(): void {
    if ((this.page * this.pageSize) < this.totalEventos) {
      this.page++;
      this.filteredEventos = this.getEventos(this.page, this.pageSize);
    }
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.filteredEventos = this.getEventos(this.page, this.pageSize);
    }
  }

  getTotalEventos(): number {
    if (this.typeFilter === 'todos'){
      return this.eventos.length;
    }
    else if (this.typeFilter === 'filtrados'){
      return this.filtrarEventos().length;
    }
    else{
      return this.filtrarActivos().length;
    }
  }

  cerrarSesion(){
    this.storageService.cerrarSesion();
    this.storageService.volverMenuPrincipal();
  }


  convertirPrimeraLetraEnMayuscula(string: String) {
    if (typeof string !== 'string' || string.length === 0) {
      return '';
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
