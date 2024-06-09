import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ColaboradorService } from '../../../../services/colaborador.service';
import { StorageService } from '../../../../services/storage.service';
import Swal from 'sweetalert2';
import { Colaborador } from '../../../../models/colaborador.model';
import { Cargo } from '../../../../models/cargo.model';
import { CargoService } from '../../../../services/cargo.service';
import { Patterns } from '../../../../utils/patterns';

@Component({
  selector: 'app-nuevo-colaborador',
  templateUrl: './nuevo-colaborador.component.html',
  styleUrl: './nuevo-colaborador.component.css'
})
export class NuevoColaboradorComponent {
  colaboradorForm: FormGroup;
  cargos!: Cargo[];
  passwordPattern: RegExp = Patterns.PASSWORD_PATTERN.getPattern();
  dniPattern: RegExp = Patterns.DNI_PATTERN.getPattern();
  phonePattern: RegExp = Patterns.PHONE_PATTERN.getPattern();
  namePattern: RegExp = Patterns.NAME_PATTERN.getPattern();

  constructor(private router: Router,
    private fb: FormBuilder,
    private colaboradorService: ColaboradorService,
    private storageService: StorageService,
    private cargoService: CargoService,
  ) {
    this.colaboradorForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      apPaterno: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      apMaterno: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      telefono: ['', [Validators.required, Validators.pattern(this.phonePattern)]],
      dni: ['', [Validators.required, Validators.pattern(this.dniPattern)]],
      email: ['', [Validators.required, Validators.email]],
      fechaContratacion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.obtenerCargos();
  }

  ngAfterViewInit(): void{
    this.storageService.comprobarSesion();
  }

  ngOnChanges(): void{
    this.storageService.comprobarSesion();
  }

  validarFormulario(){
    if (this.colaboradorForm.valid){
      this.confirmarGuardado()
    }
    else{
      Swal.fire('Datos Faltantes', 'Verifique que se estén ingresando todos los datos del Colaborador', 'error')
    }
  }

  confirmarGuardado(): void{
    const cargo = this.cargos.find(cargo => cargo.nombre == this.colaboradorForm.value.cargo);
    const nuevoColaborador: Colaborador = this.colaboradorForm.value;
    nuevoColaborador.cargoId = cargo?.id;
    let mensaje = `-Nombres: ${nuevoColaborador.nombres}<br>`;
     mensaje += `-Apellidos: ${nuevoColaborador.apPaterno} ${nuevoColaborador.apMaterno}<br>`;
     mensaje += `Dni: ${nuevoColaborador.dni}<br>`;
     mensaje += `-Telefono: ${nuevoColaborador.telefono}<br>`;
     mensaje += `-Fecha de Contratación: ${nuevoColaborador.fechaContratacion}<br>`;
     mensaje += `-Email: ${nuevoColaborador.email}<br>`;
     mensaje += `-Cargo: ${cargo?.nombre}<br>`;
    Swal.fire({
      title: 'Confirmar registro',
      html: '¿Desea registrar el cliente con los siguientes datos?<br>' + mensaje,
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      icon: 'question'
    }).then((result) => {
      if(result.isConfirmed){
        delete nuevoColaborador.cargo;
        this.guardarEncargado(nuevoColaborador);
      }
    })
  }

  guardarEncargado(colaborador: Colaborador) {
    if (this.colaboradorForm.valid) {
      this.colaboradorService.crearColaborador(colaborador).subscribe(
        (response) => {
          console.log('Colaborador creado correctamente:', response);
          Swal.fire('Colaborador Creado!', 'El Colaborador ha sido creado con éxito!', 'success')
          .then(data => this.regresarListadoColaboradores());
        },
        (error) => {
          console.error('Error al crear el colaborador:', error);
          if (error.status === 401){
            Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
          }
        }
      );
    }
  }

  obtenerCargos(){
    this.cargoService.obtenerCargos().subscribe(
      (response) => {
        console.log('Cargos obtenidos correctamente', response);
        this.cargos = response;
      },
      (error) => {
        console.error('Error al obtener los cargos', error);
        if (error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    )
  }

  regresarListadoColaboradores(){
    this.router.navigate(['/dashboard', 'colaboradores'])
  }

  cerrarSesion(){
    this.storageService.cerrarSesion();
    this.storageService.volverMenuPrincipal();
  }
}
