import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { StorageService } from '../../../services/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private storageService: StorageService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required]
    });
  }

  iniciarSesion() {
    if (this.loginForm.valid) {
      const credenciales = this.loginForm.value;
      this.authService.login(credenciales.email, credenciales.contrasena).subscribe(
        (response) => {

          console.log('Inicio de sesión exitoso:', response);
          this.storageService.guardarUsuario(response.user);
          this.storageService.guardarToken(response.token);
          this.redirigirSegunRol();
        },
        (error) => {
          Swal.fire('Error de Inicio de Sesión!', 'Su correo y contraseña no coinciden, verifique sus credenciales', 'error')
          console.error('Error de inicio de sesión:', error);
        }
      );
    }
  }

  redirigirSegunRol() {
    const rol = this.storageService.obtenerRol();
    switch (rol) {
      case 'admin':
        this.router.navigate(['/dashboard']);
        break;
      case 'cliente':
        this.router.navigate(['/cli']);
        break;
      case 'encargado':
        this.router.navigate(['/col']);
        break;
      default:
        break;
    }
  }
}
