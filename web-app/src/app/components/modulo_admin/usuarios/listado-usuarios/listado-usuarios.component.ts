import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../../services/usuario.service';
import { Usuario } from '../../../../models/usuario.model';
import { StorageService } from '../../../../services/storage.service';
import Swal from 'sweetalert2';
import { ExportPdfService } from '../../../../services/export-pdf.service';
import { ExportExcelService } from '../../../../services/export-excel.service';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.css']
})
export class ListadoUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  filteredUsuarios: Usuario[] = [];
  searchId = '';
  page: number = 1;
  pageSize: number = 5;
  totalUsuarios: number = 0;
  totalPages: number = 0;
  typeFilter: String = 'todos';

  constructor(
    private usuarioService: UsuarioService,
    private storageService: StorageService,
    private exportPdf: ExportPdfService,
    private exportExcel: ExportExcelService,
    ) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  ngAfterViewInit(): void{
    this.storageService.comprobarSesion();
  }

  ngOnChanges(): void{
    this.storageService.comprobarSesion();
  }

  resetearPaginacion(){
    this.page = 1;
    this.pageSize = 5;
  }

  mostrarTodos(){
    this.resetearPaginacion()
    this.typeFilter = 'todos';
    this.filteredUsuarios = this.getUsuarios(this.page, this.pageSize);
    this.totalUsuarios = this.getTotalUsuarios();
    this.totalPages = Math.ceil(this.totalUsuarios / this.pageSize);
  }

  mostrarActivos(){
    this.resetearPaginacion()
    this.typeFilter = 'activos';
    this.filteredUsuarios = this.getUsuarios(this.page, this.pageSize);
    this.totalUsuarios = this.getTotalUsuarios();
    this.totalPages = Math.ceil(this.totalUsuarios / this.pageSize);
  }


  obtenerUsuarios() {
    this.usuarioService.obtenerUsuarios().subscribe(
      (data: Usuario[]) => {
        this.usuarios = data;
        this.mostrarActivos();
      },
      (error) => {
        console.error('Error al obtener la lista de usuario:', error);
        if (error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha caducado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    );
  }

  buscarUsuario() {
    this.resetearPaginacion();
    this.typeFilter = 'filtrados';
    this.filteredUsuarios = this.getUsuarios(this.page, this.pageSize);
    this.totalUsuarios = this.getTotalUsuarios();
    this.totalPages = Math.ceil(this.totalUsuarios / this.pageSize);
  }

  filtrarUsuarios() : Usuario[]{
    return this.usuarios.filter((usuario) => {
      const idMatch = usuario.id && usuario.id.toString().includes(this.searchId);
      return idMatch;
    });
  }

  filtrarActivos(): Usuario[]{
    return this.usuarios.filter(usuario => usuario.status === 'activo');
  }

  resetearFiltros() {
    this.searchId = '';
    this.resetearPaginacion();
    this.filteredUsuarios = this.getUsuarios(this.page, this.pageSize);
    this.totalUsuarios = this.getTotalUsuarios();
  }

  validarEliminacion(usuario: Usuario){
    const emailUsuario = `${usuario.email}`
    Swal.fire({
      title: 'Inactivar Local',
      html: '¿Desea inactivar el usuario: <b>' + emailUsuario + '</b>?',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      icon: 'question'
    })
    .then(data => {
      if (data.isConfirmed){
        this.eliminarUsuario(usuario.id || 0)
      }
    })
  }

  eliminarUsuario(id: number) {
    this.usuarioService.eliminarUsuario(id).subscribe(
      (response) => {
        console.log('Local eliminado correctamente:', response);
        Swal.fire('Usuario Eliminado!', 'El usuario ha sido eliminado correctamente', 'success').then(data => this.obtenerUsuarios());
      },
      (error) => {
        console.error('Error al eliminar el usuario:', error);
        if (error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha caducado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    );
  }

  getUsuarios(page: number, pageSize: number): Usuario[] {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    if (this.typeFilter === 'todos'){
      return this.usuarios.slice(start, end);
    }
    else if(this.typeFilter === 'filtrados'){
      return this.filtrarUsuarios().slice(start, end);
    }
    else{
      return this.filtrarActivos().slice(start, end);
    }
  }

  nextPage(): void {
    if ((this.page * this.pageSize) < this.totalUsuarios) {
      this.page++;
      this.filteredUsuarios = this.getUsuarios(this.page, this.pageSize);
    }
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.filteredUsuarios = this.getUsuarios(this.page, this.pageSize);
    }
  }

  getTotalUsuarios(): number{
    if (this.typeFilter === 'todos'){
      return this.usuarios.length;
    }
    else if (this.typeFilter === 'filtrados'){
      return this.filtrarUsuarios().length;
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

  cerrarSesion(){
    this.storageService.cerrarSesion();
    this.storageService.volverMenuPrincipal();
  }

  exportarAPdf(){
    this.exportPdf.exportarUsuarios();
  }

  exportarAExcel(){
    this.exportExcel.exportarUsuarios();
  }
}

