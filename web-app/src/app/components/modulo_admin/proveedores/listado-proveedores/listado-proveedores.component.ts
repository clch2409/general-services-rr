import { Component, OnInit } from '@angular/core';
import { ProveedorService } from '../../../../services/proveedor.service';
import { Proveedor } from '../../../../models/proveedor.model';
import { StorageService } from '../../../../services/storage.service';
import Swal from 'sweetalert2';
import { ExportPdfService } from '../../../../services/export-pdf.service';
import { ExportExcelService } from '../../../../services/export-excel.service';

@Component({
  selector: 'app-listado-proveedores',
  templateUrl: './listado-proveedores.component.html',
  styleUrls: ['./listado-proveedores.component.css']
})
export class ListadoProveedoresComponent implements OnInit {
  proveedores: Proveedor[] = [];
  filteredProveedores: Proveedor[] = [];
  page: number = 1;
  pageSize: number = 5;
  totalProveedores: number = 0;
  totalPages: number = 0;
  typeFilter: String = 'todos';
  searchName = '';
  searchEmail = '';
  searchPhone = '';
  searchInicioDate: string = '';
  searchFinDate: string = '';

  constructor(
    private proveedorService: ProveedorService,
    private storageService: StorageService,
    private exportPdf: ExportPdfService,
    private exportExcel: ExportExcelService,
  )
   {

   }

  ngOnInit(): void {
    this.obtenerProveedores();
  }

  ngAfterViewInit(): void{
    this.storageService.comprobarSesion();
  }

  ngOnChanges(): void{
    this.storageService.comprobarSesion();
  }

  obtenerProveedores() {
    this.proveedorService.obtenerProveedores().subscribe(
      (data: Proveedor[]) => {
        this.proveedores = data;
        this.mostrarActivos();
      },
      (error) => {
        console.error('Error al obtener la lista de proveedores:', error);
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
    this.filteredProveedores = this.getProveedores(this.page, this.pageSize);
    this.totalProveedores = this.getTotalProveedores();
    this.totalPages = Math.ceil(this.totalProveedores / this.pageSize);
  }

  mostrarActivos(){
    this.resetearPaginacion()
    this.typeFilter = 'activos';
    this.filteredProveedores = this.getProveedores(this.page, this.pageSize);
    this.totalProveedores = this.getTotalProveedores();
    this.totalPages = Math.ceil(this.totalProveedores / this.pageSize);
  }

  mostrarFiltradoFechas(){
    this.resetearPaginacion()
    this.typeFilter = 'fechas';
    this.filteredProveedores = this.getProveedores(this.page, this.pageSize);
    this.totalProveedores = this.getTotalProveedores();
    this.totalPages = Math.ceil(this.totalProveedores / this.pageSize);
  }

  buscarProveedores() {
    this.resetearPaginacion();
    this.typeFilter = 'filtrados';
    this.filteredProveedores = this.getProveedores(this.page, this.pageSize);
    this.totalProveedores = this.getTotalProveedores();
    this.totalPages = Math.ceil(this.totalProveedores / this.pageSize);
  }

  filtrarActivos(){
    return this.proveedores.filter(encargado => encargado.status === 'activo');;
  }

  filtrarProveedores(): Proveedor[] {
    return this.proveedores.filter((proveedor) => {
      const nameMatch = proveedor.nombre && proveedor.nombre.toLowerCase().includes(this.searchName.toLowerCase());
      const emailMatch = proveedor.email && proveedor.email.toLowerCase().includes(this.searchEmail.toLowerCase());
      const phoneMatch = proveedor.telefono && proveedor.telefono.toLowerCase().includes(this.searchPhone);
      return nameMatch && emailMatch && phoneMatch;
    });
  }

  filtrarPorFechas(fechaInicio: string, fechaFin: string) {
    if (fechaInicio != '' && fechaFin != '') {
      const fechaInicioDate = new Date(fechaInicio);
      const fechaFinDate = new Date(fechaFin);

      const proveedoresFiltrados = this.proveedores.filter(proveedor => {
        const fechaContratoDate = new Date(proveedor.fechaContrato!);
        return fechaContratoDate >= fechaInicioDate && fechaContratoDate <= fechaFinDate;
      })

      return proveedoresFiltrados;
    }
    else{
      Swal.fire({
        title: 'Validando Fechas',
        html: 'Ingrese las fechas en los buscadores para filtrar los proveedores.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
        icon: 'error'
      });
      return this.filteredProveedores;
    }
  }

  resetearFiltros() {
    this.searchName = '';
    this.filteredProveedores = this.proveedores;
  }

  validarEliminacion(proveedor: Proveedor){
    const nombreEncargado = `${proveedor.nombre}`
    Swal.fire({
      title: 'Eliminar Proveedor',
      html: '¿Desea eliminar a: <b>' + nombreEncargado + '</b>?',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      icon: 'question'
    })
    .then(data => {
      if (data.isConfirmed){
        this.eliminarProveedor(proveedor.id || 0)
      }
    })
  }

  mostrarInsumos(proveedorId: number){
    let mensaje = 'Este proveedor cuenta con los siguientes insumos: <br>';
    const proveedorSeleccionado = this.proveedores.find(proveedor => proveedor.id === proveedorId);
    if (proveedorSeleccionado?.insumos?.length === 0){
      Swal.fire('Mostrar Insumos', 'Este proveedor no cuenta con insumos registrados, regístrelos.', 'info');
    }
    else{
      proveedorSeleccionado?.insumos?.forEach(insumo => {
        mensaje += `-${insumo.nombre}<br>`
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

  mostrarServicios(proveedorId: number){
    let mensaje = 'Este proveedor cuenta con los siguientes servicios: <br>';
    const proveedorSeleccionado = this.proveedores.find(proveedor => proveedor.id === proveedorId);
    if (proveedorSeleccionado?.servicios?.length === 0){
      Swal.fire('Mostrar Servicios', 'Este proveedor no cuenta con Servicios registrados, regístrelos.', 'info');
    }
    else{
      proveedorSeleccionado?.servicios?.forEach(servicio => {
        mensaje += `-${servicio.nombre}<br>`
      });
      Swal.fire({
        title: 'Mostrar Servicios',
        html: mensaje,
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
        icon: 'success'
      });
    }
  }

  eliminarProveedor(id: number) {
    this.proveedorService.eliminarProveedor(id).subscribe(
      (response) => {
        console.log('Proveedor eliminado correctamente:', response);
        Swal.fire('Insumo Eliminado', 'El insumo: <b>' + response.nombre + '</b> ha sido eliminado correctamente', 'success')
        .then(data => this.obtenerProveedores());

      },
      (error) => {
        console.error('Error al eliminar el proveedor:', error);
      }
    );
  }

  getProveedores(page: number, pageSize: number): Proveedor[] {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    if (this.typeFilter === 'todos'){
      return this.proveedores.slice(start, end);
    }
    else if (this.typeFilter === 'filtrados'){
      return this.filtrarProveedores().slice(start, end);
    }
    else if (this.typeFilter === 'fechas'){
      return this.filtrarPorFechas(this.searchInicioDate, this.searchFinDate).slice(start, end);
    }
    else{
      return this.filtrarActivos().slice(start, end);
    }
  }

  nextPage(): void {
    if ((this.page * this.pageSize) < this.totalProveedores) {
      this.page++;
      this.filteredProveedores = this.getProveedores(this.page, this.pageSize);
    }
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.filteredProveedores = this.getProveedores(this.page, this.pageSize);
    }
  }

  getTotalProveedores(): number{
    if (this.typeFilter === 'todos'){
      return this.proveedores.length;
    }
    else if (this.typeFilter === 'filtrados'){
      return this.filtrarProveedores().length;
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

  transformarFechaDate(fecha: string){
    return new Date(`${fecha}:01:00:00`)
  }

  transformarFechaLarga(fecha: string){
    console.log(fecha);
    const fechaContratacion = new Date(fecha);
    return fechaContratacion.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  exportarAPdf(){
    this.exportPdf.exportarProveedores();
  }

  exportarAExcel(){
    this.exportExcel.exportarProveedores();
  }
}
