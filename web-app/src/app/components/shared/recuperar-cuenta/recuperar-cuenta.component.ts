import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-recuperar-cuenta',
  templateUrl: './recuperar-cuenta.component.html',
  styleUrls: ['./recuperar-cuenta.component.css']
})
export class RecuperarCuentaComponent {
  recuperarForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private storageService: StorageService) {
    this.recuperarForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  recuperarCuenta() {
    if (this.recuperarForm.valid) {
      const email = this.recuperarForm.value.email;
      this.authService.requestPasswordRecovery(email).subscribe(
        (response) => {
          console.log('Correo de recuperación enviado:', response);
          Swal.fire('Correo Enviado!', `${response.rta.message}` , 'success');
          this.storageService.guardarUsuario(response.rta.user);

        },
        (error) => {
          // console.error('Error al enviar el correo de recuperación:', error);
          if(error.status === 404){
            Swal.fire('Error!', 'El correo ingresado no se encuentra registrado. Por favor, verifique', 'error');
          }
        }
      );
    }
    else{
      Swal.fire('Error!', 'Ingrese el email que necesita el cambio de contraseña.', 'error')
    }
  }
}
