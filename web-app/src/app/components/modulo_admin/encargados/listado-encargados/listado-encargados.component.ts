import { Component, OnInit } from '@angular/core';
import { EncargadoSalonService } from '../../../../services/encargadoSalon.service';
import { EncargadoSalon } from '../../../../models/encargadoSalon.model';
import { StorageService } from '../../../../services/storage.service';
import Swal from 'sweetalert2';
import { ExportPdfService } from '../../../../services/export-pdf.service';
import { ExportExcelService } from '../../../../services/export-excel.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listado-encargados',
  templateUrl: './listado-encargados.component.html',
  styleUrls: ['./listado-encargados.component.css']
})
export class ListadoEncargadosComponent implements OnInit {
  encargados: EncargadoSalon[] = [];
  filteredEncargados: EncargadoSalon[] = [];
  page: number = 1;
  pageSize: number = 5;
  totalEncargados: number = 0;
  totalPages: number = 0;
  typeFilter: String = 'todos';
  searchName = '';
  searchDni = '';
  searchEmail = '';
  searchInicioDate = '';
  searchFinDate = '';

  constructor(
    private encargadosService: EncargadoSalonService,
    private storageService: StorageService,
    private exportPdf: ExportPdfService,
    private exportExcel: ExportExcelService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.obtenerEncargados();

  }

  ngAfterViewInit(): void{
    this.storageService.comprobarSesion();
  }

  ngOnChanges(): void{
    this.storageService.comprobarSesion();
  }

  obtenerEncargados() {
    this.encargadosService.obtenerEncargadosSalon().subscribe(
      (data: EncargadoSalon[]) => {
        this.encargados = data;
        this.mostrarActivos();
      },
      (error) => {
        console.error('Error al obtener la lista de encargados:', error);
        if(error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha caducado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    );
  }

  buscarEncargados() {
    this.resetearPaginacion();
    this.typeFilter = 'filtrados';
    this.filteredEncargados = this.getEncargados(this.page, this.pageSize);
    this.totalEncargados = this.getTotalEncargados();
    this.totalPages = Math.ceil(this.totalEncargados / this.pageSize);
  }

  resetearPaginacion(){
    this.page = 1;
    this.pageSize = 5;
  }

  mostrarTodos(){
    this.resetearPaginacion()
    this.typeFilter = 'todos';
    this.filteredEncargados = this.getEncargados(this.page, this.pageSize);
    this.totalEncargados = this.getTotalEncargados();
    this.totalPages = Math.ceil(this.totalEncargados / this.pageSize);
  }

  mostrarActivos(){
    this.resetearPaginacion()
    this.typeFilter = 'activos';
    this.filteredEncargados = this.getEncargados(this.page, this.pageSize);
    this.totalEncargados = this.getTotalEncargados();
    this.totalPages = Math.ceil(this.totalEncargados / this.pageSize);
  }

  mostrarPorFechas(){
    this.resetearPaginacion()
    this.typeFilter = 'fechas';
    this.filteredEncargados = this.getEncargados(this.page, this.pageSize);
    this.totalEncargados = this.getTotalEncargados();
    this.totalPages = Math.ceil(this.totalEncargados / this.pageSize);
  }

  filtrarActivos(){
    return this.encargados.filter(encargado => encargado.status === 'activo');
  }

  filtrarEncargados(): EncargadoSalon[]{
    return this.encargados.filter((encargado) => {
      const nameMatch = encargado.nombres && encargado.nombres.toLowerCase().includes(this.searchName.toLowerCase());
      const dniMatch = encargado.dni && encargado.dni.includes(this.searchDni);
      const emailMatch = encargado.usuario?.email && encargado.usuario.email.includes(this.searchEmail.toLowerCase())
      return nameMatch && dniMatch && emailMatch;
    });
  }

  filtrarPorFechas(fechaInicio: string, fechaFin: string) {
    if (fechaInicio != '' && fechaFin != '') {
      const fechaInicioDate = new Date(fechaInicio);
      const fechaFinDate = new Date(fechaFin);

      const proveedoresFiltrados = this.encargados.filter(proveedor => {
        const fechaContratoDate = new Date(proveedor.fechaContratacion!);
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
      return this.filteredEncargados;
    }
  }


  resetearFiltros() {
    this.searchName = '';
    this.searchDni = '';
    this.searchEmail = '';
    this.searchInicioDate = '';
    this.searchFinDate = '';
    this.mostrarActivos();
  }

  validarEliminacion(encargado: EncargadoSalon){
    const nombreEncargado = `${encargado.nombres} ${encargado.apPaterno}`
    Swal.fire({
      title: 'Eliminar Encargado',
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
        this.eliminarEncargado(encargado.id!)
      }
    })
  }

  eliminarEncargado(id: number) {
    this.encargadosService.eliminarEncargadoSalon(id).subscribe(
      (response: EncargadoSalon) => {
        console.log('Encargado eliminado correctamente:', response);
        const nombreEncargado = `${response.nombres} ${response.apPaterno}`
        Swal.fire('Encargado Eliminado', 'El encargado: <b>' + nombreEncargado + '</b> ha sido eliminado correctamente', 'success')
        .then(data => {
          this.obtenerEncargados()
        })
      },
      (error) => {
        console.error('Error al eliminar el encargado:', error);
        if(error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha caducado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    );
  }

  irActualizarEncargado(idEncargado: number){
    this.router.navigate(['/dashboard', 'editar-encargado', idEncargado]);
  }

  cerrarSesion(){
    this.storageService.cerrarSesion();
    this.storageService.volverMenuPrincipal();
  }

  getEncargados(page: number, pageSize: number): EncargadoSalon[] {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    if (this.typeFilter === 'todos'){
      return this.encargados.slice(start, end);
    }
    else if (this.typeFilter === 'filtrados'){
      return this.filtrarEncargados().slice(start, end);
    }
    else if (this.typeFilter === 'fechas'){
      return this.filtrarPorFechas(this.searchInicioDate, this.searchFinDate).slice(start, end);
    }
    else{
      return this.filtrarActivos().slice(start, end);
    }
  }

  nextPage(): void {
    if ((this.page * this.pageSize) < this.totalEncargados) {
      this.page++;
      this.filteredEncargados = this.getEncargados(this.page, this.pageSize);
    }
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.filteredEncargados = this.getEncargados(this.page, this.pageSize);
    }
  }

  getTotalEncargados(): number{
    if (this.typeFilter === 'todos'){
      return this.encargados.length;
    }
    else if (this.typeFilter === 'filtrados'){
      return this.filtrarEncargados().length;
    }
    else if (this.typeFilter === 'fechas'){
      return this.filtrarPorFechas(this.searchInicioDate, this.searchFinDate).length;
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
    this.exportPdf.exportarEncargados();
  }

  exportarAExcel(){
    this.exportExcel.exportarEncargados();
  }
}
