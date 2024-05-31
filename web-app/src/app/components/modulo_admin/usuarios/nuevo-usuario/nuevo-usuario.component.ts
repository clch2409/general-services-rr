import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../../../services/usuario.service';
import { Usuario } from '../../../../models/usuario.model';
import { Rol } from '../../../../models/rol.model';
import { RolService } from '../../../../services/rol.service';
import Swal from 'sweetalert2';
import { StorageService } from '../../../../services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.css']
})
export class NuevoUsuarioComponent implements OnInit {
  usuarioForm!: FormGroup;
  roles!: Rol[]

  constructor(private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private storageService: StorageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.obtenerRoles();
  }

  inicializarFormulario() {
    this.usuarioForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required],
      repetirContra: ['', Validators.required],
      rol: ['', Validators.required],
    });
  }

  validarContrasenas(){
    const formulario = this.usuarioForm.value;
    if (formulario.contrasena == '' || formulario.repetirContra == ''){
      Swal.fire('Contraseñas sin ingresar', 'No se pueden verificar las contraseñas. Ingrese en los dos campos.', 'error')
    }
    else if (formulario.contrasena != formulario.repetirContra){
      Swal.fire('Contraseñas no Coincidentes', 'Las contraseñas ingresadas no coinciden, verifíquelas.', 'error')
    }
    else{
      this.validarFormulario()
    }
  }

  validarFormulario(){
    if (this.usuarioForm.valid){
      this.solicitarConfirmacion()
    }
    else{
      Swal.fire('Datos Faltantes', 'Verifique que se estén ingresando todos los datos del Usuario', 'error')
    }
  }

  solicitarConfirmacion(): void{
    delete this.usuarioForm.value.repetirContra;
    const rol = this.roles.find(rol => rol.nombre == this.usuarioForm.value.rol);
    delete this.usuarioForm.value.rol;
    const nuevoUsuario: Usuario = this.usuarioForm.value;
    nuevoUsuario.rolId = rol?.id;
    let mensaje = `<b>Email</b>: ${nuevoUsuario.email}<br>`;
     mensaje += `<b>Rol de Usuario</b>: ${rol?.nombre}<br>`;
    Swal.fire({
      title: 'Confirmar Registro',
      html: '¿Desea registrar el usuario con los siguientes datos?<br>' + mensaje,
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      icon: 'question'
    }).then((result) => {
      if(result.isConfirmed){
        this.guardarUsuario(nuevoUsuario)
      }
    })
  }

  guardarUsuario(nuevoUsuario: Usuario) {
    this.usuarioService.crearUsuario(nuevoUsuario).subscribe(
      (response) => {
        console.log('Usuario creado correctamente:', response);
        Swal.fire('Usuario Registrado', 'El usuario ha sido registrado correctamente', 'success').then(data => this.regresarListadoUsuarios());
      },
      (error) => {
        console.error('Error al crear el usuario:', error);
        if (error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    );
  }

  obtenerRoles(){
    this.rolService.obtenerRoles().subscribe(
      (response) => {
        console.log('Obtenido los roles con exito', response);
        this.roles = response;
      },
      (error) => {
        console.error('Error al obtener roles', error);
        if (error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    )
  }

  cerrarSesion(){
    this.storageService.cerrarSesion();
    this.storageService.volverMenuPrincipal();
  }

  regresarListadoUsuarios(){
    this.router.navigate(['/dashboard', 'usuarios'])
  }

  convertirPrimeraLetraEnMayuscula(string: String) {
    if (typeof string !== 'string' || string.length === 0) {
      return '';
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
