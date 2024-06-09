import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ColaboradorService } from '../../../../services/colaborador.service';
import { StorageService } from '../../../../services/storage.service';
import { Colaborador } from '../../../../models/colaborador.model';
import Swal from 'sweetalert2';
import { Cargo } from '../../../../models/cargo.model';
import { CargoService } from '../../../../services/cargo.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Patterns } from '../../../../utils/patterns';

@Component({
  selector: 'app-editar-colaborador',
  templateUrl: './editar-colaborador.component.html',
  styleUrls: ['./editar-colaborador.component.css']
})
export class EditarColaboradorComponent implements OnInit{
  colaboradorForm: FormGroup;
  colaboradorId: number;
  colaborador!: Colaborador;
  cargos!: Cargo[];
  passwordPattern: RegExp = Patterns.PASSWORD_PATTERN.getPattern();
  dniPattern: RegExp = Patterns.DNI_PATTERN.getPattern();
  phonePattern: RegExp = Patterns.PHONE_PATTERN.getPattern();
  namePattern: RegExp = Patterns.NAME_PATTERN.getPattern();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private colaboradorService: ColaboradorService,
    private storageService: StorageService,
    private cargoService: CargoService,
  ) {
    this.colaboradorId = 0;
    this.colaboradorForm = this.fb.group({});
    this.colaboradorForm = this.fb.group({});
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.colaboradorId = this.route.snapshot.params['colid'];
    this.obtenerColaborador();
  }

  ngAfterViewInit(): void{
    this.storageService.comprobarSesion();
  }

  ngOnChanges(): void{
    this.storageService.comprobarSesion();
  }

  regresarListadoColaborador(){
    this.router.navigate(['/dashboard', 'colaboradores'])
  }

  obtenerColaborador() {
    this.colaboradorService.obtenerColaboradorPorId(this.colaboradorId).subscribe({
      next: (data: any) => {
        this.colaborador = data.colaborador;
        this.colaboradorForm.patchValue({
          ...this.colaborador,
          cargo: this.colaborador.cargo?.nombre,
          fechaContratacion: new Date(data.fechaContratacion).toISOString().substring(0, 10),
        });
      },
      error: err => {
        console.error('Error al obtener encargado:', err);
        if(err.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    });
  }

  inicializarFormulario() {
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

  validarFormulario(){
    if (this.colaboradorForm.valid){
      this.solicitarConfirmacion()
    }
    else{
      Swal.fire('Datos Faltantes', 'Verifique que se estén ingresando todos los datos del Cliente', 'error')
    }
  }

  solicitarConfirmacion(): void{
    const colaboradorActualizado: Colaborador = this.colaboradorForm.value;
    let mensaje = `<b>Nombres</b>: ${colaboradorActualizado.nombres}<br>`;
     mensaje += `<b>Apellidos</b>: ${colaboradorActualizado.apPaterno} ${colaboradorActualizado.apMaterno}<br>`;
     mensaje += `<b>Dni</b>: ${colaboradorActualizado.dni}<br>`;
     mensaje += `<b>Telefono</b>: ${colaboradorActualizado.telefono}<br>`;
     mensaje += `<b>Fecha de Contratación</b>: ${colaboradorActualizado.fechaContratacion}<br>`;
     mensaje += `<b>Email</b>: ${colaboradorActualizado.email}<br>`;
    Swal.fire({
      title: 'Confirmar Actualización',
      html: '¿Desea actualizar el encargado con los siguientes datos?<br>' + mensaje,
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      icon: 'question'
    }).then((result) => {
      if(result.isConfirmed){
        delete colaboradorActualizado.cargo;
        this.guardarCambios(colaboradorActualizado);
      }
    })
  }

  guardarCambios(colaborador: Colaborador) {
    this.colaboradorService.actualizarColaborador(this.colaboradorId, colaborador).subscribe(
      (response) => {
        console.log('Colaborador actualizado correctamente:', response);
        Swal.fire('Colaborador Actualizado!', 'El Colaborador se ha sido actualizado correctamente', 'success')
        .then((result) => {
          this.regresarListadoColaborador();
        });

      },
      (error: HttpErrorResponse) => {
        console.error('Error al actualizar el encargado:', error);
        if(error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    );
  }

  // obtenerCargos(){
  //   this.cargoService.obtenerCargos().subscribe(
  //     (response) =>{
  //       console.log('Exito al obtener cargos');
  //       this.cargos = response;
  //     },
  //     (error) => {
  //       console.error('Error al actualizar el encargado:', error);
  //       if(error.status === 401){
  //         Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
  //       }
  //     }
  //   )
  // }

  cerrarSesion(){
    this.storageService.cerrarSesion();
    this.storageService.volverMenuPrincipal();
  }
}
