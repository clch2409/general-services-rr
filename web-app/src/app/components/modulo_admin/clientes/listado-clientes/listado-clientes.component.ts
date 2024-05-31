import { Component, OnInit } from '@angular/core';
import { ClienteService } from '../../../../services/cliente.service';
import { Cliente } from '../../../../models/cliente.model';
import { StorageService } from '../../../../services/storage.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

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
  typeFilter: String = 'todos';
  searchId = '';
  searchDni = '';
  searchEmail = '';

  constructor(private clienteService: ClienteService, private storageService: StorageService) {}

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
        this.filteredClientes = this.getClients(this.page, this.pageSize);
        this.totalClients = this.getTotalClientes();
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
  }

  filtrarClientes(): Cliente[] {
    return this.clientes.filter((cliente) => {
      const idMatch = cliente.id && cliente.id.toString().includes(this.searchId);
      const dniMatch = cliente.dni && cliente.dni?.includes(this.searchDni);
      const emailMatch = cliente.usuario?.email && cliente.usuario?.email?.includes(this.searchEmail);
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
    this.filteredClientes = this.getClients(this.page, this.pageSize);
    this.totalClients = this.getTotalClientes();
  }


  resetearFiltros() {
    this.searchId ='';
    this.searchDni = '';
    this.searchEmail = '';
    this.resetearPaginacion();
    this.typeFilter = 'todos';
    this.filteredClientes = this.getClients(this.page, this.pageSize);
    this.totalClients = this.getTotalClientes();
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

  eliminarCliente(id: number) {
  }
}
