import { Component, OnInit } from '@angular/core';
import { Servicio } from '../../../../models/servicio.model';
import { ServicioService } from '../../../../services/servicio.service';
import { StorageService } from '../../../../services/storage.service';
import Swal from 'sweetalert2';
import { ExportExcelService } from '../../../../services/export-excel.service';
import { ExportPdfService } from '../../../../services/export-pdf.service';
import { ProveedorService } from '../../../../services/proveedor.service';
import { Proveedor } from '../../../../models/proveedor.model';

@Component({
  selector: 'app-listar-servicio',
  templateUrl: './listar-servicio.component.html',
  styleUrl: './listar-servicio.component.css'
})
export class ListarServicioComponent implements OnInit{
  servicios: Servicio[] = [];
  filteredServicios: Servicio[] = [];
  proveedores: Proveedor[] = []
  searchProveedor = '';
  searchName = '';
  page: number = 1;
  pageSize: number = 4;
  totalServicios: number = 0;
  totalPages: number = 0;
  typeFilter: String = 'todos'

  constructor(private servicioService: ServicioService,
    private storageService: StorageService,
    private proveedorService: ProveedorService,
    private exportPdf: ExportPdfService,
    private exportExcel: ExportExcelService,
  ) {}

  ngOnInit(): void {
    this.obtenerServicios();
    this.obtenerProveedores();
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
    this.filteredServicios = this.getServicios(this.page, this.pageSize);
    this.totalServicios = this.getTotalServicios();
  }

  obtenerServicios() {
    this.servicioService.obtenerServicios().subscribe(
      (data: Servicio[]) => {
        this.servicios = data;
        this.filteredServicios = this.getServicios(this.page, this.pageSize);
        this.totalServicios = this.getTotalServicios();
        this.totalPages = Math.ceil(this.servicios.length / this.pageSize);
      },
      (error) => {
        console.error('Error al obtener la lista de locales:', error);
        if (error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha caducado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    );
  }

  obtenerProveedores(){
    this.proveedorService.obtenerProveedores().subscribe(
      (response: Proveedor[]) => {
        this.proveedores = response;
        console.log(this.proveedores)
      },
      (error) => {
        console.error('Error al obtener proveedor:', error);
        if (error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    )
  }

  buscarServicios() {
    this.resetearPaginacion();
    this.typeFilter = 'filtrados';
    this.filteredServicios = this.getServicios(this.page, this.pageSize);
    this.totalServicios = this.getTotalServicios();
    this.totalPages = Math.ceil(this.totalServicios/ this.pageSize);
  }

  filtrarServicios() : Servicio[]{
    return this.servicios.filter((servicio) => {
      const nameMatch = servicio.nombre && servicio.nombre.toLowerCase().includes(this.searchName.toLowerCase());
      const proveedorMatch = servicio.proveedor?.nombre && servicio.proveedor?.nombre.toLowerCase().includes(this.searchProveedor.toLowerCase());
      return nameMatch && proveedorMatch;
    });
  }

  resetearFiltros() {
    this.searchProveedor = '';
    this.searchName = '';
    this.resetearPaginacion();
    this.filteredServicios = this.getServicios(this.page, this.pageSize);
    this.totalServicios = this.getTotalServicios();
    this.totalPages = Math.ceil(this.totalServicios/ this.pageSize);
  }

  cerrarSesion(){
    this.storageService.cerrarSesion();
    this.storageService.volverMenuPrincipal();
  }

  getServicios(page: number, pageSize: number): Servicio[] {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    if (this.typeFilter === 'todos'){
      return this.servicios.slice(start, end);
    }
    else{
      return this.filtrarServicios().slice(start, end);
    }
  }

  nextPage(): void {
    if ((this.page * this.pageSize) < this.totalServicios) {
      this.page++;
      this.filteredServicios = this.getServicios(this.page, this.pageSize);
    }
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.filteredServicios = this.getServicios(this.page, this.pageSize);
    }
  }

  getTotalServicios(): number{
    if (this.typeFilter === 'todos'){
      return this.servicios.length;
    }
    else{
      return this.filtrarServicios().length;
    }
  }

  convertirPrimeraLetraEnMayuscula(string: String) {
    if (typeof string !== 'string' || string.length === 0) {
      return '';
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  exportarAPdf(){
    this.exportPdf.exportarServicios();
  }

  exportarAExcel(){
    this.exportExcel.exportarServicios();
  }
}
