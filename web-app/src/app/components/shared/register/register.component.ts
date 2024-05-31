import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ClienteService } from '../../../services/cliente.service';
import { Cliente } from '../../../models/cliente.model';
import { Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  clienteForm: FormGroup;
  usuarioForm: FormGroup;

  constructor(private fb: FormBuilder, private clienteService: ClienteService, private router: Router) {
    this.clienteForm = this.fb.group({
      nombres: ['', Validators.required],
      apPaterno: ['', Validators.required],
      apMaterno: ['', Validators.required],
      telefono: ['', Validators.required],
      dni: ['', Validators.required],
      direccion: ['', Validators.required],
    });
    this.usuarioForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required],
      verificarContrasena: ['', Validators.required],
    });
  }

  registrarUsuario() {
    if (this.clienteForm.valid) {
      delete this.usuarioForm.value.verificarContrasena;
      const cliente: Cliente = this.clienteForm.value;
      const usuario: Usuario = this.usuarioForm.value;
      cliente.usuario = usuario;
      this.clienteService.crearCliente(cliente).subscribe(
        (response) => {
          console.log('Usuario registrado correctamente:', response);
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Error de registro de usuario:', error);
        }
      );
    }else{
      console.log('no valido')
    }
  }
}
