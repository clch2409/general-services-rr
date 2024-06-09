import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExportPdfService {
  baseUrl = 'http://localhost:3000/api/v1/pdf';

  constructor(private http: HttpClient, private storageService: StorageService) { }

  exportarClientes(): void {
    window.location.href=`${this.baseUrl}/clientes/${this.storageService.obtenerToken()}`;
  }

  exportarColaboradores(): void {
    window.location.href=`${this.baseUrl}/colaboradores/${this.storageService.obtenerToken()}`;
  }

  exportarEncargados(): void {
    window.location.href=`${this.baseUrl}/encargados/${this.storageService.obtenerToken()}`;
  }

  exportarInsumos(): void {
    window.location.href=`${this.baseUrl}/insumos/${this.storageService.obtenerToken()}`;
  }

  exportarProveedores(): void {
    window.location.href=`${this.baseUrl}/proveedores/${this.storageService.obtenerToken()}`;
  }

  exportarRoles(): void {
    window.location.href=`${this.baseUrl}/roles/${this.storageService.obtenerToken()}`;
  }

  exportarUsuarios(): void {
    window.location.href=`${this.baseUrl}/usuarios/${this.storageService.obtenerToken()}`;
  }

  exportarTiposBuffet(): void {
    window.location.href=`${this.baseUrl}/buffets/${this.storageService.obtenerToken()}`;
  }

  exportarTiposEventos(): void {
    window.location.href=`${this.baseUrl}/tipos/evento/${this.storageService.obtenerToken()}`;
  }

  exportarLocales(): void {
    window.location.href=`${this.baseUrl}/locales/${this.storageService.obtenerToken()}`;
  }

  exportarCargos(): void {
    window.location.href=`${this.baseUrl}/cargos/${this.storageService.obtenerToken()}`;
  }

  exportarServicios(): void {
    window.location.href=`${this.baseUrl}/servicios/${this.storageService.obtenerToken()}`;
  }
}
