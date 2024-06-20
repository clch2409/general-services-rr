import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargoService } from '../../../../services/cargo.service';
import { Patterns } from '../../../../utils/patterns';
import { Cargo } from '../../../../models/cargo.model';
import Swal from 'sweetalert2';
import { StorageService } from '../../../../services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nuevo-cargo',
  templateUrl: './nuevo-cargo.component.html',
  styleUrls: ['./nuevo-cargo.component.css']
})
export class NuevoCargoComponent implements OnInit {
  cargoForm!: FormGroup;
  passwordPattern: RegExp = Patterns.PASSWORD_PATTERN.getPattern();
  namePattern: RegExp = Patterns.NAME_PATTERN.getPattern();

  constructor(private fb: FormBuilder,
    private storageService: StorageService,
    private cargoService: CargoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.cargoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(this.namePattern)]],
    });
  }

  regresarListadoCargos(){
    this.router.navigate(['/dashboard', 'cargos']);
  }

  validarFormulario(){
    if (this.cargoForm.valid){
      this.confirmarGuardado()
    }
    else{
      Swal.fire('Datos Faltantes', 'Verifique que se estén ingresando todos los datos del Cargo', 'error')
    }
  }

  confirmarGuardado(): void{
    const nuevoCargo: Cargo = this.cargoForm.value;
    const mensaje = `<b>Nombre</b>: ${nuevoCargo.nombre}`
    Swal.fire({
      title: 'Confirmar registro',
      html: '¿Desea registrar el cliente con los siguientes datos?<br>' + mensaje,
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      icon: 'question'
    }).then((result) => {
      if(result.isConfirmed){
        this.guardarCargo(nuevoCargo);
      }
    })
  }

  guardarCargo(nuevoCargo: Cargo) {
    if (this.cargoForm.valid) {
      const nuevoCargo: Cargo = this.cargoForm.value;
      this.cargoService.crearCargo(nuevoCargo).subscribe(
        (response) => {
          console.log('Cargo creado correctamente:', response);
          Swal.fire('Cargo Creado', 'El cargo ha sido creado exitosamente. Se redireccionará a la lista de cargos', 'success').then(data => this.regresarListadoCargos());
        },
        (error) => {
          console.error('Error al crear el cargo:', error);
          if (error.status === 401){
            Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
          }
        }
      );
    }
  }

  confirmarRegresarListadoCargos(){
    Swal.fire({
      title: 'Confirmar regreso',
      html: '¿Desea regresar al listado de cargos? <br> Los datos no guardados se perderán',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      icon: 'question'
    })
    .then((result) => {
      if(result.isConfirmed){
        this.regresarListadoCargos();
      }
    })
  }

  cerrarSesion(){
    this.storageService.cerrarSesion();
    this.storageService.volverMenuPrincipal();
  }
}
