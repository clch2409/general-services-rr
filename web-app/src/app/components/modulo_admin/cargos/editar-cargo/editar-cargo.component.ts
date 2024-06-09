import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cargo } from '../../../../models/cargo.model';
import { Patterns } from '../../../../utils/patterns';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CargoService } from '../../../../services/cargo.service';
import Swal from 'sweetalert2';
import { ColaboradorService } from '../../../../services/colaborador.service';
import { StorageService } from '../../../../services/storage.service';

@Component({
  selector: 'app-editar-cargo',
  templateUrl: './editar-cargo.component.html',
  styleUrls: ['./editar-cargo.component.css']
})
export class EditarCargoComponent implements OnInit {
  cargoForm: FormGroup;
  cargoId: number;
  cargo: Cargo = new Cargo();
  passwordPattern: RegExp = Patterns.PASSWORD_PATTERN.getPattern();
  namePattern: RegExp = Patterns.NAME_PATTERN.getPattern();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private cargoService: CargoService,
    private storageService: StorageService,
  ) {
    this.cargoId = 0;
    this.cargoForm = this.fb.group({});
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.cargoId = this.route.snapshot.params['carid'];
    this.obtenerCargo();
  }

  regresarListadoCargos(){
    this.router.navigate(['/dashboard', 'cargos']);
  }

  obtenerCargo() {
    this.cargoService.obtenerCargoPorId(this.cargoId).subscribe({
      next: (data: Cargo) => {
        this.cargo = data;
        console.log(data)
        this.cargoForm.patchValue(data);
      },
      error: err => {
        console.error('Error al obtener cargo:', err);
        if (err.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    });
  }

  inicializarFormulario() {
    this.cargoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(this.namePattern)]],
    });
  }

  validarFormulario(){
    if (this.cargoForm.valid){
      this.solicitarConfirmacion()
    }
    else{
      Swal.fire('Datos Faltantes', 'Verifique que se estén ingresando todos los datos del cargo', 'error')
    }
  }

  solicitarConfirmacion(): void{
    const cargoActualizado: Cargo = this.cargoForm.value;
    let mensaje = `<b>Nombre</b>: ${cargoActualizado.nombre}<br>`;
    Swal.fire({
      title: 'Confirmar Actualización',
      html: '¿Desea actualizar el cargo con los siguientes datos?<br>' + mensaje,
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      icon: 'question'
    }).then((result) => {
      if(result.isConfirmed){
        this.guardarCambios(cargoActualizado);
      }
    })
  }

  guardarCambios(cargoActualizado: Cargo) {
    cargoActualizado.nombre = cargoActualizado.nombre?.toLowerCase();
    this.cargoService.actualizarCargo(this.cargoId, cargoActualizado).subscribe(
      (response) => {
        console.log('Cargo actualizado correctamente:', response);
        Swal.fire('Cargo Actualizado', 'El cargo fue actualizado correctamente. Pasará al listado de cargos', 'success').then(data => this.regresarListadoCargos());
      },
      (error) => {
        console.error('Error al actualizar el cargo:', error);
        if (error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    );
  }

  cerrarSesion(){
    this.storageService.cerrarSesion();
    this.storageService.volverMenuPrincipal();
  }
}

