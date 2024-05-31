import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Usuario } from '../models/usuario.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api/v1/auth';
  private usuarioRol: string = '';

  constructor(private http: HttpClient, private cookieService: CookieService, private storageService: StorageService) {

  }

  // login y guardardado de token
  login(email: string, contrasena: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, contrasena });
  }

  // Obtener el rol del usuario autenticado
  obtenerRolUsuario(): string {
    return localStorage.getItem('rol')?.toString() || '';
  }

  // Método para guardar el rol cuando el usuario inicia sesión
  guardarRolUsuario(rol: string): void {
    localStorage.setItem('rol', rol)
  }

  // nuevo usuario
  registrarUsuario(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, usuario);
  }

  // recuperación de contraseña
  requestPasswordRecovery(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/recovery`, { email }, {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.storageService.obtenerToken()}`
      })
    });
  }

  // restablecer contraseña con el token recibido
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/change/password`, { token, newPassword });
  }

  // guardar el token en cookie
  guardarToken(token: string): void {
    this.cookieService.set('token', token);
  }

  // token de la cookie
  obtenerToken(): string {
    return this.cookieService.get('token');
  }

  // verificar si el usuario está autenticado??
  isAuthenticated(): boolean {
    const token = this.obtenerToken();
    return !!token;
  }

  // eliminar cookie
  logout(): void {
    this.cookieService.delete('token');
    this.cookieService.delete('user');
    window.location.href = '/';
  }
}
