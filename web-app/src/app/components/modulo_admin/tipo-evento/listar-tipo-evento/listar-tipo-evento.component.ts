import { Component, OnInit } from '@angular/core';
import { TipoEvento } from '../../../../models/tipoEvento.model';
import { TipoEventoService } from '../../../../services/tipoEvento.service';
import { StorageService } from '../../../../services/storage.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ExportExcelService } from '../../../../services/export-excel.service';
import { ExportPdfService } from '../../../../services/export-pdf.service';

@Component({
  selector: 'app-listar-tipo-evento',
  templateUrl: './listar-tipo-evento.component.html',
  styleUrl: './listar-tipo-evento.component.css'
})
export class ListarTipoEventoComponent implements OnInit{
  tiposEvento: TipoEvento[] = [];
  filteredTiposEvento: TipoEvento[] = [];
  searchId = '';
  searchName = '';
  page: number = 1;
  pageSize: number = 4;
  totalTiposEvento: number = 0;
  typeFilter: String = 'todos'

  constructor(
    private tipoEventoService: TipoEventoService,
    private storageService: StorageService,
    private exportPdf: ExportPdfService,
    private exportExcel: ExportExcelService,
  ) {}

  ngOnInit(): void {
    this.obtenerTiposEventos();
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
    this.filteredTiposEvento = this.getTiposBuffet(this.page, this.pageSize);
    this.totalTiposEvento = this.getTotalTiposEvento();
  }

  obtenerTiposEventos() {
    this.tipoEventoService.obtenerTipoEventos().subscribe(
      (data: TipoEvento[]) => {
        this.tiposEvento = data;
        this.filteredTiposEvento = this.getTiposBuffet(this.page, this.pageSize);
        this.totalTiposEvento = this.getTotalTiposEvento()
      },
      (error: HttpErrorResponse) => {
        console.error('Error al obtener la lista de locales:', error);
        if (error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha caducado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    );
  }

  buscarTipoEvento() {
    this.resetearPaginacion();
    this.typeFilter = 'filtrados';
    this.filteredTiposEvento = this.getTiposBuffet(this.page, this.pageSize);
  }

  filtrarTipoEvento() : TipoEvento[]{
    return this.tiposEvento.filter((tipoEvento) => {
      const idMatch = tipoEvento.id && tipoEvento.id.toString().includes(this.searchId);
      const nameMatch = tipoEvento.nombre && tipoEvento.nombre.includes(this.searchName);
      return idMatch && nameMatch;
    });
  }

  resetearFiltros() {
    this.searchId = '';
    this.searchName = '';
    this.resetearPaginacion();
    this.filteredTiposEvento = this.getTiposBuffet(this.page, this.pageSize);
    this.totalTiposEvento = this.getTotalTiposEvento();
  }

  cerrarSesion(){
    this.storageService.cerrarSesion();
    this.storageService.volverMenuPrincipal();
  }

  getTiposBuffet(page: number, pageSize: number): TipoEvento[] {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    if (this.typeFilter === 'todos'){
      return this.tiposEvento.slice(start, end);
    }
    else{
      return this.filtrarTipoEvento().slice(start, end);
    }
  }

  nextPage(): void {
    if ((this.page * this.pageSize) < this.totalTiposEvento) {
      this.page++;
      this.filteredTiposEvento = this.getTiposBuffet(this.page, this.pageSize);
    }
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.filteredTiposEvento = this.getTiposBuffet(this.page, this.pageSize);
    }
  }

  getTotalTiposEvento(): number{
    if (this.typeFilter === 'todos'){
      return this.tiposEvento.length;
    }
    else{
      return this.filtrarTipoEvento().length;
    }
  }

  convertirPrimeraLetraEnMayuscula(string: String) {
    if (typeof string !== 'string' || string.length === 0) {
      return '';
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  exportarAPdf(){
    this.exportPdf.exportarTiposEventos();
  }

  exportarAExcel(){
    this.exportExcel.exportarTiposEventos();
  }
}
