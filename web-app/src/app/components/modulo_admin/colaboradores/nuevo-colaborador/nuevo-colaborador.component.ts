import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ColaboradorService } from '../../../../services/colaborador.service';
import { StorageService } from '../../../../services/storage.service';
import Swal from 'sweetalert2';
import { Colaborador } from '../../../../models/colaborador.model';
import { Cargo } from '../../../../models/cargo.model';
import { CargoService } from '../../../../services/cargo.service';

@Component({
  selector: 'app-nuevo-colaborador',
  templateUrl: './nuevo-colaborador.component.html',
  styleUrl: './nuevo-colaborador.component.css'
})
export class NuevoColaboradorComponent {
  colaboradorForm: FormGroup;
  passwordPattern: RegExp = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,16}$/);
  dniPattern: RegExp = new RegExp(/^\d{8,9}$/);
  phonePattern: RegExp = new RegExp(/^\d{9}$/);
  namePattern: RegExp = new RegExp(/^[A-Za-z\sñ]+$/);
  cargos!: Cargo[]

  constructor(private router: Router,
    private fb: FormBuilder,
    private colaboradorService: ColaboradorService,
    private storageService: StorageService,
    private cargoService: CargoService,
  ) {
    this.colaboradorForm = this.fb.group({
      nombres: ['', Validators.required],
      apPaterno: ['', Validators.required],
      apMaterno: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dni: ['', Validators.required],
      cargo: ['', Validators.required],
      fechaContratacion: ['', Validators.required],
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