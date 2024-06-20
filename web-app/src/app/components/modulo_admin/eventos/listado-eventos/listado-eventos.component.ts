import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { EventoService } from '../../../../services/evento.service';
import { StorageService } from '../../../../services/storage.service';
import { Evento } from '../../../../models/evento.model';
import { Router } from '@angular/router';


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
  totalPages: number = 0;
  typeFilter: string = 'todos';
  searchInicioDate: string = '';
  searchFinDate: string = '';

  constructor(private eventoService: EventoService, private storageService: StorageService, private router: Router) {}

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
        this.mostrarTodos()
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
    this.totalPages = Math.ceil(this.totalEventos / this.pageSize);
  }

  mostrarReservados(){
    this.resetearPaginacion()
    this.typeFilter = 'activos';
    this.filteredEventos = this.getEventos(this.page, this.pageSize);
    this.totalEventos = this.getTotalEventos();
    this.totalPages = Math.ceil(this.totalEventos / this.pageSize);
  }

  buscarEventos() {
    this.resetearPaginacion();
    this.typeFilter = 'fechas';
    this.filteredEventos = this.getEventos(this.page, this.pageSize);
    this.totalEventos = this.getTotalEventos();
    this.totalPages = Math.ceil(this.totalEventos / this.pageSize);
  }

  mostrarEnProceso(){
    this.resetearPaginacion();
    this.typeFilter = 'en proceso';
    this.filteredEventos = this.getEventos(this.page, this.pageSize);
    this.totalEventos = this.getTotalEventos();
    this.totalPages = Math.ceil(this.totalEventos / this.pageSize);
  }

  filtrarReservados(){
    return this.eventos.filter(evento => evento.status === 'reservado');
  }

  filtrarEnProceso(){
    return this.eventos.filter(evento => evento.status === 'en proceso');
  }

  filtrarPorFechas(fechaInicio: string, fechaFin: string) {
    if (fechaInicio != '' && fechaFin != '') {
      const fechaInicioDate = new Date(fechaInicio);
      const fechaFinDate = new Date(fechaFin);

      const eventosFiltrados = this.eventos.filter(evento => {
        const fechaEventoDate = new Date(evento.fechaEvento!);
        return fechaEventoDate >= fechaInicioDate && fechaEventoDate <= fechaFinDate;
      })

      return eventosFiltrados;
    }
    else{
      Swal.fire({
        title: 'Validando Fechas',
        html: 'Ingrese las fechas en los buscadores para filtrar los eventos',
        confirmButtonText: 'OK',
        icon: 'error'
      });
      return this.filteredEventos;
    }
  }

  validarEliminacion(evento: Evento){
    if (evento.status === 'cancelado'){
      Swal.fire({
        title: 'Cancelar Evento',
        html: 'El evento ya se ecuentra cancelado. No puede cancelarlo de nuevo',
        confirmButtonText: 'OK',
        icon: 'error'
      })
    }
    else{
      Swal.fire({
        title: 'Cancelar Evento',
        html: '¿Desea cancelar el siguiente evento?',
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
  }

  eliminarEvento(id: number) {
    this.eventoService.cancelarEvento(id).subscribe(
      (response: Evento) => {
        console.log('Evento cancelado correctamente:', response);
        Swal.fire('Evento Eliminado', 'El evento ha sido eliminado correctamente', 'success')
       .then(data => {
          this.obtenerEventos()
          this.totalPages = Math.ceil(this.filteredEventos.length / this.pageSize);
        })
      },
      (error) => {
        console.error('Error al eliminar el evento:', error);
      }
    );
  }

  validarIrEditarEvento(evento: Evento){
    if (evento.status !== 'reservado'){
      Swal.fire({
        title: 'Editar Evento',
        html: `No puede ir a Editar el Evento, ya que el evento está: ${this.convertirPrimeraLetraEnMayuscula(evento.status!)}`,
        confirmButtonText: 'OK',
        icon: 'error'
      })
    }
    else{
      this.irEditarEvento(evento)
    }
  }

  irEditarEvento(evento: Evento){
    this.router.navigate(['/dashboard', 'editar-evento', evento.id]);
  }

  validarIrAsignarColaboradores(evento: Evento){
    if (evento.status === 'en proceso' || evento.status === 'cancelado'){
      Swal.fire({
        title: 'Asignar Colaboradores',
        html: `No es posible asignar colaboradores al evento, ya que el evento está: ${this.convertirPrimeraLetraEnMayuscula(evento.status!)}`,
        confirmButtonText: 'OK',
        icon: 'error'
      })
    }
    else if(evento.status === 'asignado'){
      Swal.fire({
        title: 'Asignar Colaboradores',
        html: `Usted ya ha asignado colaboradores. Si desea hacer cambios, el evento pasará a estado "En Proceso". Recurde guardar el evento para que pase a Asignado. <b>¿Desea continuar?</b>`,
        showCancelButton: true,
        cancelButtonText: 'No',
        confirmButtonText: 'Sí',
        icon: 'question'
      })
    }
    else{
      this.irAsignarColaboradores(evento)
    }
  }

  irAsignarColaboradores(evento: Evento){
    this.router.navigate(['/dashboard', 'asignar-colabs', evento.id]);
  }

  resetearFiltros() {
    this.searchInicioDate = '';
    this.searchFinDate = '';
    this.typeFilter = 'todos';
    this.filteredEventos = this.getEventos(this.page, this.pageSize);
  }

  getEventos(page: number, pageSize: number): Evento[] {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    if (this.typeFilter === 'todos'){
      return this.eventos.slice(start, end);
    }
    else if (this.typeFilter === 'fechas'){
      return this.filtrarPorFechas(this.searchInicioDate, this.searchFinDate).slice(start, end);
    }
    else if (this.typeFilter === 'en proceso'){
      return this.filtrarEnProceso().slice(start, end);
    }
    else{
      return this.filtrarReservados().slice(start, end);
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
    else if (this.typeFilter === 'fechas'){
      return this.filtrarPorFechas(this.searchInicioDate, this.searchFinDate).length;
    }
    else if (this.typeFilter === 'en proceso'){
      return this.filtrarEnProceso().length;
    }
    else{
      return this.filtrarReservados().length;
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

  transformarFechaLarga(fecha: string){
    const fechaDate = new Date(fecha);
    return fechaDate.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  transformarHora(hora: string){
    const horaConFecha = new Date(hora);
    return horaConFecha.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }
}
