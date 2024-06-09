import { Component, OnInit } from '@angular/core';
import { TipoBuffet } from '../../../../models/tipoBuffet.model';
import { TipoBuffetService } from '../../../../services/tipoBuffet.service';
import { StorageService } from '../../../../services/storage.service';
import Swal from 'sweetalert2';
import { ExportExcelService } from '../../../../services/export-excel.service';
import { ExportPdfService } from '../../../../services/export-pdf.service';

@Component({
  selector: 'app-listar-tipo-buffet',
  templateUrl: './listar-tipo-buffet.component.html',
  styleUrl: './listar-tipo-buffet.component.css'
})
export class ListarTipoBuffetComponent implements OnInit{
  tiposBuffet: TipoBuffet[] = [];
  filteredTiposBuffet: TipoBuffet[] = [];
  searchId = '';
  searchName = '';
  page: number = 1;
  pageSize: number = 4;
  totalBuffets: number = 0;
  typeFilter: String = 'todos'

  constructor(
    private tipoBuffetService: TipoBuffetService,
    private storageService: StorageService,
    private exportPdf: ExportPdfService,
    private exportExcel: ExportExcelService,
  ) {}

  ngOnInit(): void {
    this.obtenerTiposBuffet();
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
    this.filteredTiposBuffet = this.getTiposBuffet(this.page, this.pageSize);
    this.totalBuffets = this.getTotalBuffets();
  }

  obtenerTiposBuffet() {
    this.tipoBuffetService.obtenerTipoBuffet().subscribe(
      (data: TipoBuffet[]) => {
        this.tiposBuffet = data;
        this.filteredTiposBuffet = this.getTiposBuffet(this.page, this.pageSize);
        this.totalBuffets = this.getTotalBuffets()
      },
      (error) => {
        console.error('Error al obtener la lista de locales:', error);
        if (error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha caducado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    );
  }

  buscarTipoBuffet() {
    this.resetearPaginacion();
    this.typeFilter = 'filtrados';
    this.filteredTiposBuffet = this.getTiposBuffet(this.page, this.pageSize);
  }

  filtrarBuffets() : TipoBuffet[]{
    return this.tiposBuffet.filter((tipoBuffet) => {
      const idMatch = tipoBuffet.id && tipoBuffet.id.toString().includes(this.searchId);
      const nameMatch = tipoBuffet.nombre && tipoBuffet.nombre.includes(this.searchName);
      return idMatch && nameMatch;
    });
  }

  resetearFiltros() {
    this.searchId = '';
    this.searchName = '';
    this.resetearPaginacion();
    this.filteredTiposBuffet = this.getTiposBuffet(this.page, this.pageSize);
    this.totalBuffets = this.getTotalBuffets();
  }

  cerrarSesion(){
    this.storageService.cerrarSesion();
    this.storageService.volverMenuPrincipal();
  }

  getTiposBuffet(page: number, pageSize: number): TipoBuffet[] {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    if (this.typeFilter === 'todos'){
      return this.tiposBuffet.slice(start, end);
    }
    else{
      return this.filtrarBuffets().slice(start, end);
    }
  }

  nextPage(): void {
    if ((this.page * this.pageSize) < this.totalBuffets) {
      this.page++;
      this.filteredTiposBuffet = this.getTiposBuffet(this.page, this.pageSize);
    }
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.filteredTiposBuffet = this.getTiposBuffet(this.page, this.pageSize);
    }
  }

  getTotalBuffets(): number{
    if (this.typeFilter === 'todos'){
      return this.tiposBuffet.length;
    }
    else{
      return this.filtrarBuffets().length;
    }
  }

  convertirPrimeraLetraEnMayuscula(string: String) {
    if (typeof string !== 'string' || string.length === 0) {
      return '';
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  exportarAPdf(){
    this.exportPdf.exportarTiposBuffet();
  }

  exportarAExcel(){
    this.exportExcel.exportarTiposBuffet();
  }
}
