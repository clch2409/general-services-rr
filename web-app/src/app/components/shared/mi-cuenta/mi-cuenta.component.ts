import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { Usuario } from '../../../models/usuario.model';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-mi-cuenta',
  templateUrl: './mi-cuenta.component.html',
  styleUrls: ['./mi-cuenta.component.css']
})
export class MiCuentaComponent {
  credencialesForm: FormGroup;
  token: string ="";
  usuario: Usuario;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private authService: AuthService, private storageService: StorageService, private router: Router) {
    this.route.params.subscribe(params => {
      this.token = params['token'];
    });

    this.credencialesForm = this.fb.group({
      contrasenaNueva: ['', Validators.required],
      repetirContrasena: ['', Validators.required],
      nuevoEmail: ['']
    });
    this.usuario = this.storageService.obtenerUsuario();
    this.verificarUsuario()

  }

  verificarUsuario(){

    if (!this.usuario){
      Swal.fire('Error!', 'Por favor, solicite otro correo para recuperación de contraseña', 'error').then(data => this.storageService.volverMenuPrincipal())
    }
  }

  verificarContrasenas(){
    const contra = this.credencialesForm.value.contrasenaNueva;
    const contraRepeat = this.credencialesForm.value.repetirContrasena;
    const iguales = contra === contraRepeat;

    if (iguales){
      this.actualizarCredenciales()
    }
    else{
      Swal.fire('Error!', 'Las contraseñas no coinciden, verifiquelas', 'error')
    }
  }

  actualizarCredenciales() {
    if (this.credencialesForm.valid) {
      const contrasenaNueva = this.credencialesForm.value.contrasenaNueva;
      const nuevoEmail = this.credencialesForm.value.nuevoEmail;

      this.authService.resetPassword(this.token, contrasenaNueva).subscribe(
        (response) => {
          console.log('Credenciales actualizadas correctamente:', response);
          this.storageService.borrarUsuario();
          Swal.fire('Credenciales Actualizadas!', 'Su contraseña ha sido actualizada. Ahora pasará a la pantalla de Inicio de Sesión', 'success').then((data) => this.router.navigate(['/']))
          //"Credenciales actualizadas con éxito"
        },
        (error) => {
          console.error('Error al actualizar las credenciales:', error);
          if (error.error.message === 'jwt expired'){
            Swal.fire('Error!', 'El tiempo de recuperación ha expirado. Solicite otro correo.', 'error')
          }

        }
      );
    }
    else{
      Swal.fire('Error!', 'Ingrese los datos completos', 'error')
    }
  }
}
