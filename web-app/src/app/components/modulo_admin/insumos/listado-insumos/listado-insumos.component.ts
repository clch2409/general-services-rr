import { Component, OnInit } from '@angular/core';
import { InsumoService } from '../../../../services/insumo.service';
import { Insumo } from '../../../../models/insumo.model';
import { StorageService } from '../../../../services/storage.service';
import Swal from 'sweetalert2';
import { ExportPdfService } from '../../../../services/export-pdf.service';
import { ExportExcelService } from '../../../../services/export-excel.service';
import { Proveedor } from '../../../../models/proveedor.model';
import { ProveedorService } from '../../../../services/proveedor.service';

@Component({
  selector: 'app-listado-insumos',
  templateUrl: './listado-insumos.component.html',
  styleUrls: ['./listado-insumos.component.css']
})
export class ListadoInsumosComponent implements OnInit {
  insumos: Insumo[] = [];
  filteredInsumos: Insumo[] = [];
  proveedores: Proveedor[] = [];
  page: number = 1;
  pageSize: number = 5;
  totalInsumos: number = 0;
  totalPages: number = 0;
  typeFilter: String = 'todos';
  searchName = '';
  searchProveedor = '';
  searchInitialPrice = 0;
  searchFinalPrice = 0;

  constructor(
    private insumoService: InsumoService,
    private storageService: StorageService,
    private proveedorService: ProveedorService,
    private exportPdf: ExportPdfService,
    private exportExcel: ExportExcelService,
  ) {}

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

  obtenerProveedores(){
    this.proveedorService.obtenerProveedores().subscribe(
      (response: Proveedor[]) => {
        this.proveedores = response;
        console.log(this.proveedores)
      },
      (error) => {
        console.error('Error al obtener proveedor:', error);
        if (error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    )
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
    this.totalPages = Math.ceil(this.totalInsumos / this.pageSize);
  }

  mostrarActivos(){
    this.resetearPaginacion()
    this.typeFilter = 'activos';
    this.filteredInsumos = this.getInsumos(this.page, this.pageSize);
    this.totalInsumos = this.getTotalInsumos();
    this.totalPages = Math.ceil(this.totalInsumos / this.pageSize);
  }

  mostrarPorPrecios() {
    this.resetearPaginacion();
    this.typeFilter = 'precios';
    this.filteredInsumos = this.getInsumos(this.page, this.pageSize);
    this.totalInsumos = this.getTotalInsumos();
    this.totalPages = Math.ceil(this.totalInsumos / this.pageSize);
  }

  buscarInsumos() {
    this.resetearPaginacion();
    this.typeFilter = 'filtrados';
    this.filteredInsumos = this.getInsumos(this.page, this.pageSize);
    this.totalInsumos = this.getTotalInsumos();
    this.totalPages = Math.ceil(this.totalInsumos / this.pageSize);
  }

  filtrarActivos(){
    return this.insumos.filter(encargado => encargado.status === 'activo');;
  }

  filtrarInsumos(): Insumo[] {
    return this.insumos.filter((insumo) => {
      const nameMatch = insumo.nombre && insumo.nombre.toLowerCase().includes(this.searchName.toLowerCase());
      const proveedorMatch = insumo.proveedor?.nombre && insumo.proveedor?.nombre.toLowerCase().includes(this.searchProveedor.toLowerCase());
      return nameMatch && proveedorMatch;
    });
  }

  filtrarPorPrecios(precioInicial: number, precioFinal: number): Insumo[] {
    if (precioInicial === 0 && precioFinal === 0){
      Swal.fire({
        title: 'Filtrar por Precio!',
        html: 'Ingrese los precios para realizar la búsqueda',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
      })
      return this.filteredInsumos
    }
    else{
      return this.insumos.filter(insumo => insumo.precio! >= precioInicial && insumo.precio! <= precioFinal);
    }
  }

  validarEliminacion(insumo: Insumo){
    const nombreInsumo = `${insumo.nombre}`
    Swal.fire({
      title: '¿Desea eliminar el insumo?',
      html: 'Se eliminara el insumo: <b>' + nombreInsumo + '</b>',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
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
        Swal.fire({
          title: 'Insumo Eliminado!',
          html: 'El insumo: <b>' + nombreInsumo + '</b> ha sido eliminado correctamente',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6',
        })
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
    this.searchName = '';
    this.searchInitialPrice = 0;
    this.searchFinalPrice = 0;
    this.mostrarActivos();
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
    else if (this.typeFilter === 'precios'){
      return this.filtrarPorPrecios(this.searchInitialPrice, this.searchFinalPrice).slice(start, end);
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
    else if (this.typeFilter === 'precios'){
      return this.filtrarPorPrecios(this.searchInitialPrice, this.searchFinalPrice).length;
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

  exportarAPdf(){
    this.exportPdf.exportarInsumos();
  }

  exportarAExcel(){
    this.exportExcel.exportarInsumos();
  }
}
