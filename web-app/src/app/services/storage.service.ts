import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';

const USER_DATA = 'auth-user';
const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private router: Router, private cookieService: CookieService) { }

  public guardarUsuario(usuario: any): void {
    this.cookieService.set(USER_DATA, JSON.stringify(usuario), undefined, '/');
  }

  public obtenerUsuario(): any {
    const usuario = this.cookieService.get(USER_DATA);
    return usuario ? JSON.parse(usuario) : null;
  }

  public borrarUsuario(): void{
    this.cookieService.deleteAll('/')
  }

  public sesionIniciada(): boolean {
    return this.cookieService.check(USER_DATA);
  }

  public cerrarSesion(): void {
    this.cookieService.deleteAll('/');
    this.cookieService.deleteAll('/dashboard');
    Swal.fire('Sesión Cerrada!', 'Sesión Cerrada con Éxito!', 'success').then(data => this.volverMenuPrincipal());
  }

  public comprobarSesion(): void {
    if(!this.sesionIniciada()){
      this.noInicioSesion()
    }
  }

  public noInicioSesion(){
    Swal.fire('Error!', 'Inicie sesión primero, por favor!', 'error').then(data => this.volverMenuPrincipal());
  }

  public volverMenuPrincipal(): void{
      this.router.navigate(['/']);
  }

  public obtenerRol(): any {
    const usuario = this.obtenerUsuario();
    return usuario ? usuario.rol.nombre : null;
  }

  public guardarToken(token: string): void {
    this.cookieService.set(TOKEN_KEY, token, undefined, '/');
  }

  public obtenerToken(): string {
    return this.cookieService.get(TOKEN_KEY);
  }

  public borrarToken(): void {
    this.cookieService.deleteAll('/')
  }
}
