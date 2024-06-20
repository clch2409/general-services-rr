import { Component, OnInit } from '@angular/core';
import { Cargo } from '../../../../models/cargo.model';
import { CargoService } from '../../../../services/cargo.service';
import { StorageService } from '../../../../services/storage.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ExportPdfService } from '../../../../services/export-pdf.service';
import { ExportExcelService } from '../../../../services/export-excel.service';

@Component({
  selector: 'app-listar-cargos',
  templateUrl: './listar-cargos.component.html',
  styleUrls: ['./listar-cargos.component.css']
})
export class ListarCargosComponent implements OnInit {
  cargos: Cargo[] = [];
  filteredCargos: Cargo[] = [];
  searchId = '';
  searchNombre = '';
  totalPages: number = 0;
  page: number = 1;
  pageSize: number = 5;
  totalCargos!: number;
  typeFilter: String = '';

  constructor(private cargoService: CargoService,
    private storageService: StorageService,
    private router: Router,
    private exportPdf: ExportPdfService,
    private exportExcel: ExportExcelService
  ) {}

  ngOnInit(): void {
    this.obtenerCargos();
  }

  resetearPaginacion(){
    this.page = 1;
    this.pageSize = 5;
  }

  obtenerCargos() {
    this.cargoService.obtenerCargos().subscribe(
      (data: Cargo[]) => {
        this.cargos = data;
        this.mostrarTodos();
      },
      (error) => {
        console.error('Error al obtener la lista de cargos:', error);
        if (error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha caducado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    );
  }

  mostrarTodos(){
    this.resetearPaginacion();
    this.typeFilter = 'todos';
    this.filteredCargos = this.getCargos(this.page, this.pageSize);
    this.totalCargos = this.getTotalCargos();
    this.totalPages = Math.ceil(this.totalCargos / this.pageSize);
  }

  buscarCargos() {
    this.resetearPaginacion();
    this.typeFilter = 'filtrados';
    this.filteredCargos = this.getCargos(this.page, this.pageSize);
    this.totalCargos = this.getTotalCargos();
    this.totalPages = Math.ceil(this.totalCargos / this.pageSize);
  }

  filtrarCargos() : Cargo[]{
    return this.cargos.filter((cargo) => {
      const idMatch = cargo.id && cargo.id.toString().includes(this.searchId);
      const idNombre = cargo.nombre && cargo.nombre.toLowerCase().includes(this.searchNombre.toLowerCase());
      return idMatch && idNombre;
    });
  }

  resetearFiltros() {
    this.searchId = '';
    this.searchNombre = '';
    this.mostrarTodos();
  }

  getCargos(page: number, pageSize: number): Cargo[] {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    if (this.typeFilter === 'todos'){
      return this.cargos.slice(start, end);
    }
    else{
      return this.filtrarCargos().slice(start, end);
    }
  }

  nextPage(): void {
    if ((this.page * this.pageSize) < this.totalCargos) {
      this.page++;
      this.filteredCargos = this.getCargos(this.page, this.pageSize);
    }
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.filteredCargos = this.getCargos(this.page, this.pageSize);
    }
  }

  getTotalCargos(): number{
    if (this.typeFilter === 'todos'){
      return this.cargos.length;
    }
    else{
      return this.filtrarCargos().length;
    }
  }

  exportarAPdf(){
    this.exportPdf.exportarCargos();
  }

  exportarAExcel(){
    this.exportExcel.exportarCargos();
  }

  cerrarSesion(){
    this.storageService.cerrarSesion();
    this.storageService.volverMenuPrincipal();
  }
}
