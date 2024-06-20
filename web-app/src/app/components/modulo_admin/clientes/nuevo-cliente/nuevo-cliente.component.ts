import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../../../../services/cliente.service';
import { Cliente } from '../../../../models/cliente.model';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { Usuario } from '../../../../models/usuario.model';
import { StorageService } from '../../../../services/storage.service';
import { Router } from '@angular/router';
import { Patterns } from '../../../../utils/patterns';

@Component({
  selector: 'app-nuevo-cliente',
  templateUrl: './nuevo-cliente.component.html',
  styleUrls: ['./nuevo-cliente.component.css']
})
export class NuevoClienteComponent implements OnInit {
  clienteForm!: FormGroup;
  usuarioForm!: FormGroup;
  passwordPattern: RegExp = Patterns.PASSWORD_PATTERN.getPattern();
  dniPattern: RegExp = Patterns.DNI_PATTERN.getPattern();
  phonePattern: RegExp = Patterns.PHONE_PATTERN.getPattern();
  namePattern: RegExp = Patterns.NAME_PATTERN.getPattern();
  directionPattern: RegExp = Patterns.DIRECTION_PATTERN.getPattern();

  constructor(private fb: FormBuilder, private clienteService: ClienteService, private storageService: StorageService, private router: Router) { }

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  ngAfterViewInit(): void{
    this.storageService.comprobarSesion();
  }

  ngOnChanges(): void{
    this.storageService.comprobarSesion();
  }

  inicializarFormulario() {
    this.clienteForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      apPaterno: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      apMaterno: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      telefono: ['', [Validators.required, Validators.pattern(this.phonePattern)]],
      dni: ['', [Validators.required, Validators.pattern(this.dniPattern)]],
      direccion: ['', [Validators.required, Validators.pattern(this.directionPattern)]]
    });
    this.usuarioForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      repetir_contrasena: ['', [Validators.required, Validators.pattern(this.passwordPattern)]]
    });
  }

  validarFormulario(){
    if (this.clienteForm.valid && this.usuarioForm.valid){
      this.validarContrasenas()
    }
    else{
      Swal.fire('Datos Faltantes', 'Verifique que los datos han sido ingresados correctamente', 'error')
    }
  }

  validarContrasenas() : void{
    const contra = this.usuarioForm.value.contrasena;
    const repetirContra = this.usuarioForm.value.repetir_contrasena;
    const camposLlenos = contra !== '' && repetirContra !== ''
    const contrasIguales = contra === repetirContra;

    if (contrasIguales && camposLlenos){
      this.confirmarGuardado()
    }
    else{
      Swal.fire('Contraseñas no Coincidentes', 'Verifique sus contraseñas, no son iguales.', 'error')
    }
  }

  confirmarGuardado(): void{
    delete this.usuarioForm.value.repetir_contrasena;
    const nuevoUsuario: Usuario = this.usuarioForm.value;
    const nuevoCliente: Cliente = this.clienteForm.value;
    let mensaje = `Nombres: ${nuevoCliente.nombres}<br>`;
     mensaje += `Apellidos: ${nuevoCliente.apPaterno} ${nuevoCliente.apMaterno}<br>`;
     mensaje += `Dni: ${nuevoCliente.dni}<br>`;
     mensaje += `Telefono: ${nuevoCliente.telefono}<br>`;
     mensaje += `Direccion: ${nuevoCliente.direccion}<br>`;
     mensaje += `Email: ${nuevoUsuario.email}<br>`;
    Swal.fire({
      title: 'Confirmar registro',
      html: '¿Desea registrar el cliente con los siguientes datos?<br>' + mensaje,
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      icon: 'question'
    }).then((result) => {
      if(result.isConfirmed){
        nuevoCliente.usuario = nuevoUsuario;
        this.guardarCliente(nuevoCliente);
      }
    })
  }

  guardarCliente(cliente: Cliente) : void{
    this.clienteService.crearCliente(cliente).subscribe(
      (response) => {
        console.log('Cliente creado correctamente:', response);
        Swal.fire('Creado', 'El cliente se ha registrado correctamente', 'success')
        .then((result) => {
          this.regresarListadoClientes();
        })
      },
      (error: HttpErrorResponse) => {
        console.error('Error al crear el cliente:', error);
        if(error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
        if (error.status === 406){
          Swal.fire('Error al Crear Cliente', error.error.message.message, 'error');
        }
      }
    );
  }

  confirmarRegresoListadoClientes(){
    Swal.fire({
      title: 'Confirmar Regreso',
      html: '¿Desea regresar al listado de Clientes? <br>El progreso realizado se perderá',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      icon: 'question'
    }).then((result) => {
      if(result.isConfirmed){
        this.regresarListadoClientes();
      }
    })
  }

  regresarListadoClientes(){
    this.router.navigate(['/dashboard', 'clientes'])
  }

  cerrarSesion(){
    this.storageService.cerrarSesion();
    this.storageService.volverMenuPrincipal();
  }
}
