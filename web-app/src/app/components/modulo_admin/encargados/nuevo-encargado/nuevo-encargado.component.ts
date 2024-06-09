import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EncargadoSalonService } from '../../../../services/encargadoSalon.service';
import { EncargadoSalon } from '../../../../models/encargadoSalon.model';
import Swal from 'sweetalert2';
import { Usuario } from '../../../../models/usuario.model';
import { Router } from '@angular/router';
import { StorageService } from '../../../../services/storage.service';
import { Patterns } from '../../../../utils/patterns';

@Component({
  selector: 'app-nuevo-encargado',
  templateUrl: './nuevo-encargado.component.html',
  styleUrls: ['./nuevo-encargado.component.css']
})
export class NuevoEncargadoComponent implements OnInit {
  encargadoForm: FormGroup;
  usuarioForm: FormGroup;
  passwordPattern: RegExp = Patterns.PASSWORD_PATTERN.getPattern();
  dniPattern: RegExp = Patterns.DNI_PATTERN.getPattern();
  phonePattern: RegExp = Patterns.PHONE_PATTERN.getPattern();
  namePattern: RegExp = Patterns.NAME_PATTERN.getPattern();

  constructor(private router: Router, private fb: FormBuilder, private encargadoService: EncargadoSalonService, private storageService: StorageService) {
    this.encargadoForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      apPaterno: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      apMaterno: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      telefono: ['', [Validators.required, Validators.pattern(this.phonePattern)]],
      dni: ['', [Validators.required, Validators.pattern(this.dniPattern)]],
      fechaContratacion: ['', Validators.required]
    });
    this.usuarioForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      repetir_contrasena: ['', [Validators.required, Validators.pattern(this.passwordPattern)]]
    });
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void{
    this.storageService.comprobarSesion();
  }

  ngOnChanges(): void{
    this.storageService.comprobarSesion();
  }

  validarFormulario(){
    console.log({
      encargado: this.encargadoForm.value,
      usuario: this.usuarioForm.value
    })
    if (this.encargadoForm.valid && this.usuarioForm.valid){
      this.validarContrasenas()
    }
    else{
      Swal.fire('Datos Faltantes', 'Verifique que se estén ingresando todos los datos del Encargado', 'error')
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
    const nuevoEncargado: EncargadoSalon = this.encargadoForm.value;
    let mensaje = `Nombres: ${nuevoEncargado.nombres}<br>`;
     mensaje += `Apellidos: ${nuevoEncargado.apPaterno} ${nuevoEncargado.apMaterno}<br>`;
     mensaje += `Dni: ${nuevoEncargado.dni}<br>`;
     mensaje += `Telefono: ${nuevoEncargado.telefono}<br>`;
     mensaje += `Fecha de Contratación: ${nuevoEncargado.fechaContratacion}<br>`;
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
        nuevoEncargado.usuario = nuevoUsuario;
        this.guardarEncargado(nuevoEncargado);
      }
    })
  }

  guardarEncargado(encargado: EncargadoSalon) {
    if (this.encargadoForm.valid) {
      this.encargadoService.crearEncargadoSalon(encargado).subscribe(
        (response) => {
          console.log('Encargado creado correctamente:', response);
          Swal.fire('Encargado Creado!', 'El encargado ha sido creado con éxito!', 'success')
          .then(data => this.router.navigate(['/dashboard', 'encargados']));
        },
        (error) => {
          console.error('Error al crear el encargado:', error);
          if (error.status === 401){
            Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
          }
        }
      );
    }
  }

  cerrarSesion(){
    this.storageService.cerrarSesion();
    this.storageService.volverMenuPrincipal();
  }
}
