import { Component, OnInit } from '@angular/core';
import { Servicio } from '../../../../models/servicio.model';
import { ServicioService } from '../../../../services/servicio.service';
import { StorageService } from '../../../../services/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-servicio',
  templateUrl: './listar-servicio.component.html',
  styleUrl: './listar-servicio.component.css'
})
export class ListarServicioComponent implements OnInit{
  servicios: Servicio[] = [];
  filteredServicios: Servicio[] = [];
  searchId = '';
  searchName = '';
  page: number = 1;
  pageSize: number = 4;
  totalServicios: number = 0;
  typeFilter: String = 'todos'

  constructor(private servicioService: ServicioService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.obtenerLocal();
  }

  ngAfterViewInit(): void{
    this.storageService.comprobarSesion();
  }

  ngOnChanges(): void{
    this.storageService.comprobarSesion();
  }

  resetearPaginacion(){
    this.page = 1;
    this.pageSize = 4;
  }

  mostrarTodos(){
    this.resetearPaginacion()
    this.typeFilter = 'todos';
    this.filteredServicios = this.getServicios(this.page, this.pageSize);
    this.totalServicios = this.getTotalServicios();
  }

  obtenerLocal() {
    this.servicioService.obtenerServicios().subscribe(
      (data: Servicio[]) => {
        this.servicios = data;
        this.filteredServicios = this.getServicios(this.page, this.pageSize);
        this.totalServicios = this.getTotalServicios()
      },
      (error) => {
        console.error('Error al obtener la lista de locales:', error);
        if (error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha caducado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    );
  }

  buscarServicios() {
    this.resetearPaginacion();
    this.typeFilter = 'filtrados';
    this.filteredServicios = this.getServicios(this.page, this.pageSize);
  }

  filtrarServicios() : Servicio[]{
    return this.servicios.filter((servicio) => {
      const idMatch = servicio.id && servicio.id.toString().includes(this.searchId);
      const nameMatch = servicio.nombre && servicio.nombre.includes(this.searchName);
      return idMatch && nameMatch;
    });
  }

  resetearFiltros() {
    this.searchId = '';
    this.searchName = '';
    this.resetearPaginacion();
    this.filteredServicios = this.getServicios(this.page, this.pageSize);
    this.totalServicios = this.getTotalServicios();
  }

  cerrarSesion(){
    this.storageService.cerrarSesion();
    this.storageService.volverMenuPrincipal();
  }

  getServicios(page: number, pageSize: number): Servicio[] {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    if (this.typeFilter === 'todos'){
      return this.servicios.slice(start, end);
    }
    else{
      return this.filtrarServicios().slice(start, end);
    }
  }

  nextPage(): void {
    if ((this.page * this.pageSize) < this.totalServicios) {
      this.page++;
      this.filteredServicios = this.getServicios(this.page, this.pageSize);
    }
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.filteredServicios = this.getServicios(this.page, this.pageSize);
    }
  }

  getTotalServicios(): number{
    if (this.typeFilter === 'todos'){
      return this.servicios.length;
    }
    else{
      return this.filtrarServicios().length;
    }
  }

  convertirPrimeraLetraEnMayuscula(string: String) {
    if (typeof string !== 'string' || string.length === 0) {
      return '';
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

}
