import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../../../services/cliente.service';
import { Cliente } from '../../../../models/cliente.model';
import { StorageService } from '../../../../services/storage.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ExportPdfService } from '../../../../services/export-pdf.service';
import { ExportExcelService } from '../../../../services/export-excel.service';

@Component({
  selector: 'app-listado-clientes',
  templateUrl: './listado-clientes.component.html',
  styleUrls: ['./listado-clientes.component.css']
})
export class ListadoClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  filteredClientes: Cliente[] = [];
  page: number = 1;
  pageSize: number = 5;
  totalClients: number = 0;
  totalPages: number = 0;
  typeFilter: String = 'todos';
  searchName = '';
  searchDni = '';
  searchEmail = '';

  constructor(private clienteService: ClienteService,
    private storageService: StorageService,
    private exportPdf: ExportPdfService,
    private exportExcel: ExportExcelService,
  ) {}

  ngOnInit(): void {
    this.obtenerClientes();
  }

  ngAfterViewInit(): void{
    this.storageService.comprobarSesion();
  }

  ngOnChanges(): void{
    this.storageService.comprobarSesion();
  }

  obtenerClientes() {
    this.clienteService.obtenerClientes().subscribe(
      (data: Cliente[]) => {
        this.clientes = data;
        this.mostrarTodos();

      },
      (error: HttpErrorResponse) => {
        console.error('Error al obtener la lista de clientes:', error);
        if (error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    );
  }

  buscarClientes() {
    this.resetearPaginacion();
    this.typeFilter = 'filtrados';
    this.filteredClientes = this.getClients(this.page, this.pageSize);
    this.totalClients = this.getTotalClientes();
    this.totalPages = Math.ceil(this.totalClients / this.pageSize);
  }

  filtrarClientes(): Cliente[] {
    return this.clientes.filter((cliente) => {
      const nameMatch = cliente.nombres && cliente.nombres.toLowerCase().includes(this.searchName.toLowerCase());
      const dniMatch = cliente.dni && cliente.dni?.includes(this.searchDni);
      const emailMatch = cliente.usuario?.email && cliente.usuario?.email?.includes(this.searchEmail.toLowerCase());
      return nameMatch && dniMatch && emailMatch;
    });

  }

  resetearPaginacion(){
    this.page = 1;
    this.pageSize = 5;
  }

  mostrarTodos(){
    this.resetearPaginacion()
    this.typeFilter = 'todos';
    this.filteredClientes = this.getClients(this.page, this.pageSize);
    this.totalClients = this.getTotalClientes();
    this.totalPages = Math.ceil(this.totalClients / this.pageSize);
  }


  resetearFiltros() {
    this.searchName ='';
    this.searchDni = '';
    this.searchEmail = '';
    this.resetearPaginacion();
    this.typeFilter = 'todos';
    this.filteredClientes = this.getClients(this.page, this.pageSize);
    this.totalClients = this.getTotalClientes();
    this.totalPages = Math.ceil(this.totalClients / this.pageSize);
  }

  cerrarSesion(){
    this.storageService.cerrarSesion();
    this.storageService.volverMenuPrincipal();
  }

  /* Paginacion */

  getClients(page: number, pageSize: number): Cliente[] {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    if (this.typeFilter === 'todos'){
      return this.clientes.slice(start, end);
    }
    else{
      return this.filtrarClientes().slice(start, end);
    }
  }

  nextPage(): void {
    if ((this.page * this.pageSize) < this.totalClients) {
      this.page++;
      this.filteredClientes = this.getClients(this.page, this.pageSize);
    }
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.filteredClientes = this.getClients(this.page, this.pageSize);
    }
  }

  getTotalClientes(): number{
    if (this.typeFilter === 'todos'){
      return this.clientes.length;
    }
    else{
      return this.filtrarClientes().length;
    }
  }

  convertirPrimeraLetraEnMayuscula(string: String) {
    if (typeof string !== 'string' || string.length === 0) {
      return '';
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  exportarAPdf(){
    this.exportPdf.exportarClientes();
  }

  exportarAExcel(){
    this.exportExcel.exportarClientes();
  }
}
