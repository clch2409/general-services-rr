import { Component, OnInit } from '@angular/core';
import { Colaborador } from '../../../../models/colaborador.model';
import { ColaboradorEvento } from '../../../../models/colaboradorEvento';
import { StorageService } from '../../../../services/storage.service';
import { ColaboradorService } from '../../../../services/colaborador.service';
import Swal from 'sweetalert2';
import { ExportPdfService } from '../../../../services/export-pdf.service';
import { ExportExcelService } from '../../../../services/export-excel.service';

@Component({
  selector: 'app-listar-colaboradores',
  templateUrl: './listar-colaboradores.component.html',
  styleUrl: './listar-colaboradores.component.css'
})
export class ListarColaboradoresComponent implements OnInit{
  colaboradores: Colaborador[] = [];
  filteredColaboradores: Colaborador[] = [];
  page: number = 1;
  pageSize: number = 5;
  totalColaboradores: number = 0;
  typeFilter: String = 'todos';
  searchId = '';
  searchDni = '';
  searchEmail = '';

  constructor(
    private colaboradoresService: ColaboradorService,
    private storageService: StorageService,
    private exportPdf: ExportPdfService,
    private exportExcel: ExportExcelService,
  ) { }

  ngOnInit(): void {
    this.obtenerColaboradores();

  }

  ngAfterViewInit(): void{
    this.storageService.comprobarSesion();
  }

  ngOnChanges(): void{
    this.storageService.comprobarSesion();
  }

  obtenerColaboradores() {
    this.colaboradoresService.obtenerColaboradores().subscribe(
      (data: Colaborador[]) => {
        this.colaboradores = data;
        this.filteredColaboradores = this.getColaboradores(this.page, this.pageSize);
        this.totalColaboradores = this.getTotalColaboradores();
        this.mostrarActivos();
      },
      (error) => {
        console.error('Error al obtener la lista de colaboradores:', error);
        if(error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha caducado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    );
  }

  buscarColaboradores() {
    this.resetearPaginacion();
    this.typeFilter = 'filtrados';
    this.filteredColaboradores = this.getColaboradores(this.page, this.pageSize);
  }

  filtrarColaboradores(): Colaborador[]{
    return this.colaboradores.filter((colaborador) => {
      const idMatch = colaborador.id && colaborador.id.toString().includes(this.searchId);
      const dniMatch = colaborador.dni && colaborador.dni.includes(this.searchDni);
      const emailMatch = colaborador.email && colaborador.email.includes(this.searchEmail)
      return idMatch && dniMatch && emailMatch;
    });
  }

  resetearPaginacion(){
    this.page = 1;
    this.pageSize = 5;
  }

  mostrarTodos(){
    this.resetearPaginacion()
    this.typeFilter = 'todos';
    this.filteredColaboradores = this.getColaboradores(this.page, this.pageSize);
    this.totalColaboradores = this.getTotalColaboradores();
  }

  mostrarActivos(){
    this.resetearPaginacion()
    this.typeFilter = 'activos';
    this.filteredColaboradores = this.getColaboradores(this.page, this.pageSize);
    this.totalColaboradores = this.getTotalColaboradores();
  }

  filtrarActivos(){
    return this.colaboradores.filter(colaborador => colaborador.status === 'activo');
  }

  resetearFiltros() {
    this.searchId = '';
    this.searchDni = '';
    this.searchEmail = '';
    this.resetearPaginacion();
    this.filteredColaboradores = this.getColaboradores(this.page, this.pageSize);
    this.totalColaboradores = this.getTotalColaboradores();
  }

  validarEliminacion(encargado: Colaborador){
    const nombreEncargado = `${encargado.nombres} ${encargado.apPaterno}`
    Swal.fire({
      title: 'Eliminar Colaborador',
      html: '¿Desea eliminar a: <b>' + nombreEncargado + '</b>?',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      icon: 'question'
    })
    .then(data => {
      if (data.isConfirmed){
        this.eliminarColaborador(encargado.id || 0)
      }
    })
  }

  eliminarColaborador(id: number) {
    this.colaboradoresService.eliminarColaborador(id).subscribe(
      (response: Colaborador) => {
        console.log('Colaborador eliminado correctamente:', response);
        const nombreColaborador = `${response.nombres} ${response.apPaterno}`
        Swal.fire('Colaborador Eliminado', 'El Colaborador: <b>' + nombreColaborador + '</b> ha sido eliminado correctamente', 'success')
        .then(data => {
          this.obtenerColaboradores()
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

  cerrarSesion(){
    this.storageService.cerrarSesion();
    this.storageService.volverMenuPrincipal();
  }

  getColaboradores(page: number, pageSize: number): Colaborador[] {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    if (this.typeFilter == 'todos'){
      return this.colaboradores.slice(start, end);
    }
    else if (this.typeFilter === 'filtrados'){
      return this.filtrarColaboradores().slice(start, end);
    }
    else if (this.typeFilter === 'activos'){
      return this.filtrarActivos().slice(start, end);
    }
    else{
      return this.colaboradores;
    }
  }

  nextPage(): void {
    if ((this.page * this.pageSize) < this.totalColaboradores) {
      this.page++;
      this.filteredColaboradores = this.getColaboradores(this.page, this.pageSize);
    }
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.filteredColaboradores = this.getColaboradores(this.page, this.pageSize);
    }
  }

  getTotalColaboradores(): number{
    if (this.typeFilter == 'todos'){
      return this.colaboradores.length;
    }
    else if (this.typeFilter === 'filtrados'){
      return this.filtrarColaboradores().length;
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
    this.exportPdf.exportarColaboradores();
  }

  exportarAExcel(){
    this.exportExcel.exportarColaboradores();
  }
}
