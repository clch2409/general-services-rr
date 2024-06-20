import { Component, OnInit } from '@angular/core';
import { Local } from '../../../../models/local.model';
import { LocalService } from '../../../../services/local.service';
import Swal from 'sweetalert2';
import { StorageService } from '../../../../services/storage.service';
import { ExportExcelService } from '../../../../services/export-excel.service';
import { ExportPdfService } from '../../../../services/export-pdf.service';

@Component({
  selector: 'app-listado-salones',
  templateUrl: './listado-salones.component.html',
  styleUrls: ['./listado-salones.component.css']
})
export class ListadoSalonesComponent implements OnInit {
  local: Local[] = [];
  filteredLocal: Local[] = [];
  searchId = '';
  searchName = '';
  page: number = 1;
  pageSize: number = 5;
  totalLocales: number = 0;
  totalPages: number = 0;
  typeFilter: String = 'todos'

  constructor(
    private localService: LocalService,
    private storageService: StorageService,
    private exportPdf: ExportPdfService,
    private exportExcel: ExportExcelService,
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
    this.filteredLocal = this.getLocales(this.page, this.pageSize);
    this.totalLocales = this.getTotalLocales();
    this.totalPages = Math.ceil(this.local.length / this.pageSize);
  }

  mostrarActivos(){
    this.resetearPaginacion()
    this.typeFilter = 'activos';
    this.filteredLocal = this.getLocales(this.page, this.pageSize);
    this.totalLocales = this.getTotalLocales();
    this.totalPages = Math.ceil(this.local.length / this.pageSize);
  }

  buscarLocal() {
    this.resetearPaginacion();
    this.typeFilter = 'filtrados';
    this.filteredLocal = this.getLocales(this.page, this.pageSize);
    this.totalLocales = this.getTotalLocales();
    this.totalPages = Math.ceil(this.totalLocales / this.pageSize);
  }

  filtrarLocales() : Local[]{
    return this.local.filter((local) => {
      const idMatch = local.id && local.id.toString().includes(this.searchId);
      const nameMatch = local.nombre && local.nombre.toLowerCase().includes(this.searchName);
      return idMatch && nameMatch;
    });
  }

  filtrarActivos(): Local[]{
    return this.local.filter(encargado => encargado.status === 'activo');
  }

  resetearFiltros() {
    this.searchId = '';
    this.searchName = '';
    this.mostrarActivos();
  }

  validarEliminacion(salon: Local){
    const nombreSalon = `${salon.nombre}`
    Swal.fire({
      title: 'Inactivar Local',
      html: '¿Desea inactivar el local: <b>' + nombreSalon + '</b>?',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      icon: 'question'
    })
    .then(data => {
      if (data.isConfirmed){
        this.eliminarLocal(salon.id || 0)
      }
    })
  }

  obtenerLocal() {
    this.localService.obtenerLocales().subscribe(
      (data: Local[]) => {
        this.local = data;
        this.mostrarActivos()
      },
      (error) => {
        console.error('Error al obtener la lista de locales:', error);
        if (error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha caducado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    );
  }



  eliminarLocal(id: number) {
    this.localService.eliminarLocal(id).subscribe(
      (response) => {
        console.log('Local eliminado correctamente:', response);
        this.obtenerLocal();
      },
      (error) => {
        console.error('Error al eliminar el local:', error);
        if (error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha caducado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    );
  }

  mostrarInsumos(localId: number){
    let mensaje = 'Este local cuenta con los siguientes insumos: <br>';
    const localSeleccionado = this.local.find(local => local.id === localId);
    if (localSeleccionado?.insumos?.length === 0){
      Swal.fire({
        title: 'Mostrar Insumos',
        html: 'Este local no cuenta con insumos registrados, regístrelos.',
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
        icon: 'info'
      });
    }
    else{
      localSeleccionado?.insumos?.forEach(insumo => {
        mensaje += `-${insumo.nombre} --> ${insumo.InsumoLocal?.cantidad}<br>`
      });
      Swal.fire({
        title: 'Mostrar Insumos',
        html: mensaje,
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
        icon: 'success'
      });
    }
  }

  cerrarSesion(){
    this.storageService.cerrarSesion();
    this.storageService.volverMenuPrincipal();
  }

  mostrarPrecios(id: number){
    let mensaje = 'Los precios de este local son: <br>';
    const localSeleccionado = this.local.find(local => local.id == id);
    const preciosOrdenados = localSeleccionado?.precios?.sort((a, b) => a.id! - b.id!)
    if (localSeleccionado?.precios?.length === 0){
      Swal.fire({
        title: 'Mostrar Precios',
        html: 'Este local no cuenta con precios registrados, regístrelos.',
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
        icon: 'info'
      });
    }
    else{
      preciosOrdenados?.forEach(dia => {
        mensaje += `-${this.convertirPrimeraLetraEnMayuscula(dia.nombre!)} --> S/.${dia.LocalDia?.precioLocal}<br>`
      });
      Swal.fire({
        title: 'Mostrar Precios',
        html: mensaje,
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
        icon: 'success'
      });
    }
  }

  getLocales(page: number, pageSize: number): Local[] {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    if (this.typeFilter === 'todos'){
      return this.local.slice(start, end);
    }
    else if(this.typeFilter === 'filtrados'){
      return this.filtrarLocales().slice(start, end);
    }
    else{
      return this.filtrarActivos().slice(start, end);
    }
  }

  nextPage(): void {
    if ((this.page * this.pageSize) < this.totalLocales) {
      this.page++;
      this.filteredLocal = this.getLocales(this.page, this.pageSize);
    }
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.filteredLocal = this.getLocales(this.page, this.pageSize);
    }
  }

  getTotalLocales(): number{
    if (this.typeFilter === 'todos'){
      return this.local.length;
    }
    else if (this.typeFilter === 'filtrados'){
      return this.filtrarLocales().length;
    }
    else{
      return this.filtrarActivos().length;
    }
  }

  convertirPrimeraLetraEnMayuscula(string: String) {
    if (typeof string !== 'string' || string.length === 0) {
      return '';
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  exportarAPdf(){
    this.exportPdf.exportarLocales();
  }

  exportarAExcel(){
    this.exportExcel.exportarLocales();
  }
}
