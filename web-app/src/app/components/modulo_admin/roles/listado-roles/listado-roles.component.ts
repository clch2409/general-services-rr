import { Component, OnInit } from '@angular/core';
import { RolService } from '../../../../services/rol.service';
import { Rol } from '../../../../models/rol.model';
import { StorageService } from '../../../../services/storage.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ExportExcelService } from '../../../../services/export-excel.service';
import { ExportPdfService } from '../../../../services/export-pdf.service';

@Component({
  selector: 'app-listado-roles',
  templateUrl: './listado-roles.component.html',
  styleUrls: ['./listado-roles.component.css']
})
export class ListadoRolesComponent implements OnInit {
  roles: Rol[] = [];
  filteredRoles: Rol[] = [];
  searchId = '';
  page: number = 1;
  pageSize: number = 5;
  totalRoles: number = 0;
  typeFilter: String = '';

  constructor(private rolService: RolService,
    private storageService: StorageService,
    private router: Router,
    private exportPdf: ExportPdfService,
    private exportExcel: ExportExcelService,
  ) {}

  ngOnInit(): void {
    this.obtenerRoles();
  }

  resetearPaginacion(){
    this.page = 1;
    this.pageSize = 5;
  }

  obtenerRoles() {
    this.rolService.obtenerRoles().subscribe(
      (data: Rol[]) => {
        this.roles = data;
        this.filteredRoles = data;
      },
      (error) => {
        console.error('Error al obtener la lista de roles:', error);
        if (error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha caducado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    );
  }

  buscarRoles() {
    this.resetearPaginacion();
    this.typeFilter = 'filtrados';
    this.filteredRoles = this.getRoles(this.page, this.pageSize);
  }

  filtrarRoles() : Rol[]{
    return this.roles.filter((local) => {
      const idMatch = local.id && local.id.toString().includes(this.searchId);
      return idMatch;
    });
  }

  resetearFiltros() {
    this.searchId = '';
    this.resetearPaginacion();
    this.filteredRoles = this.getRoles(this.page, this.pageSize);
    this.totalRoles = this.getTotalRoles();
  }

  getRoles(page: number, pageSize: number): Rol[] {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    if (this.typeFilter === 'todos'){
      return this.roles.slice(start, end);
    }
    else{
      return this.filtrarRoles().slice(start, end);
    }
  }

  nextPage(): void {
    if ((this.page * this.pageSize) < this.totalRoles) {
      this.page++;
      this.filteredRoles = this.getRoles(this.page, this.pageSize);
    }
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.filteredRoles = this.getRoles(this.page, this.pageSize);
    }
  }

  getTotalRoles(): number{
    if (this.typeFilter === 'todos'){
      return this.roles.length;
    }
    else{
      return this.filtrarRoles().length;
    }
  }

  cerrarSesion(){
    this.storageService.cerrarSesion();
    this.storageService.volverMenuPrincipal();
  }

  exportarAPdf(){
    this.exportPdf.exportarRoles();
  }

  exportarAExcel(){
    this.exportExcel.exportarRoles();
  }
}
