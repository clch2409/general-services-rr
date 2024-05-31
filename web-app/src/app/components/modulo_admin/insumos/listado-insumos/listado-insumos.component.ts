import { Component, OnInit } from '@angular/core';
import { InsumoService } from '../../../../services/insumo.service';
import { Insumo } from '../../../../models/insumo.model';
import { StorageService } from '../../../../services/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listado-insumos',
  templateUrl: './listado-insumos.component.html',
  styleUrls: ['./listado-insumos.component.css']
})
export class ListadoInsumosComponent implements OnInit {
  insumos: Insumo[] = [];
  filteredInsumos: Insumo[] = [];
  page: number = 1;
  pageSize: number = 5;
  totalInsumos: number = 0;
  typeFilter: String = 'todos';
  searchId = '';

  constructor(private insumoService: InsumoService, private storageService: StorageService) {}

  ngOnInit(): void {
    this.obtenerInsumos();
  }

  ngAfterViewInit(): void{
    this.storageService.comprobarSesion();
  }

  ngOnChanges(): void{
    this.storageService.comprobarSesion();
  }

  obtenerInsumos() {
    this.insumoService.obtenerInsumos().subscribe(
      (data: Insumo[]) => {
        this.insumos = data;
        this.filteredInsumos = this.getInsumos(this.page, this.pageSize);
        this.totalInsumos = this.getTotalInsumos()
        this.mostrarActivos()
      },
      (error) => {
        console.error('Error al obtener la lista de insumos:', error);
        if(error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha caducado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
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
    this.filteredInsumos = this.getInsumos(this.page, this.pageSize);
    this.totalInsumos = this.getTotalInsumos();
  }

  mostrarActivos(){
    this.resetearPaginacion()
    this.typeFilter = 'activos';
    this.filteredInsumos = this.getInsumos(this.page, this.pageSize);
    this.totalInsumos = this.getTotalInsumos();
  }

  buscarInsumos() {
    this.resetearPaginacion();
    this.typeFilter = 'filtrados';
    this.filteredInsumos = this.getInsumos(this.page, this.pageSize);
  }

  filtrarActivos(){
    return this.insumos.filter(encargado => encargado.status === 'activo');;
  }

  filtrarInsumos(): Insumo[] {
    return this.insumos.filter((insumo) => {
      const idMatch = insumo.id && insumo.id.toString().includes(this.searchId);
      return idMatch;
    });
  }

  validarEliminacion(insumo: Insumo){
    const nombreEncargado = `${insumo.nombre}`
    Swal.fire({
      title: 'Eliminar Insumo',
      html: '¿Desea eliminar a: <b>' + nombreEncargado + '</b>?',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      icon: 'question'
    })
    .then(data => {
      if (data.isConfirmed){
        this.eliminarInsumo(insumo.id || 0)
      }
    })
  }

  eliminarInsumo(id: number) {
    this.insumoService.eliminarInsumo(id).subscribe(
      (response: Insumo) => {
        console.log('Insumo eliminado correctamente:', response);
        const nombreInsumo = `${response.nombre}`
        Swal.fire('Insumo Eliminado', 'El insumo: <b>' + nombreInsumo + '</b> ha sido eliminado correctamente', 'success')
        .then(data => {
          this.obtenerInsumos()
        })
      },
      (error) => {
        console.error('Error al eliminar el encargado:', error);
      }
    );
  }


  resetearFiltros() {
    this.searchId = '';
    this.filteredInsumos = this.insumos;
  }

  getInsumos(page: number, pageSize: number): Insumo[] {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    if (this.typeFilter === 'todos'){
      return this.insumos.slice(start, end);
    }
    else if (this.typeFilter === 'filtrados'){
      return this.filtrarInsumos().slice(start, end);
    }
    else{
      return this.filtrarActivos().slice(start, end);
    }
  }

  nextPage(): void {
    if ((this.page * this.pageSize) < this.totalInsumos) {
      this.page++;
      this.filteredInsumos = this.getInsumos(this.page, this.pageSize);
    }
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.filteredInsumos = this.getInsumos(this.page, this.pageSize);
    }
  }

  getTotalInsumos(): number{
    if (this.typeFilter === 'todos'){
      return this.insumos.length;
    }
    else if (this.typeFilter === 'filtrados'){
      return this.filtrarInsumos().length;
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
