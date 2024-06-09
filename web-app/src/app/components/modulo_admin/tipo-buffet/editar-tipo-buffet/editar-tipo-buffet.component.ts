import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoBuffet } from '../../../../models/tipoBuffet.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoBuffetService } from '../../../../services/tipoBuffet.service';
import { StorageService } from '../../../../services/storage.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Patterns } from '../../../../utils/patterns';

@Component({
  selector: 'app-editar-tipo-buffet',
  templateUrl: './editar-tipo-buffet.component.html',
  styleUrl: './editar-tipo-buffet.component.css'
})
export class EditarTipoBuffetComponent implements OnInit{
  tipoBuffetForm: FormGroup;
  tipoBuffetId: number;
  tipoBuffet!: TipoBuffet;
  passwordPattern: RegExp = Patterns.PASSWORD_PATTERN.getPattern();
  namePattern: RegExp = Patterns.NAME_PATTERN.getPattern();


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private tipoBuffetService: TipoBuffetService,
    private storageService: StorageService
  ) {
    this.tipoBuffetId = 0;
    this.tipoBuffetForm = this.fb.group({});
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.tipoBuffetId = this.route.snapshot.params['bufid'];
    this.obtenerSalon();
  }

  ngAfterViewInit(): void{
    this.storageService.comprobarSesion();
  }

  ngOnChanges(): void{
    this.storageService.comprobarSesion();
  }

  regresarListadoBuffets(){
    this.router.navigate(['/dashboard', 'tipo-buffet']);
  }

  obtenerSalon() {
    this.tipoBuffetService.obtenerTipoBuffetPorId(this.tipoBuffetId).subscribe({
      next: (data: TipoBuffet) => {
        this.tipoBuffet = data;
        this.tipoBuffetForm.patchValue({
          ...data
        })
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al obtener salón:', err);
        if (err.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    });
  }

  inicializarFormulario() {
    this.tipoBuffetForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      precioPorPlato: ['', Validators.required],
    });
  }

  validarFormulario(){
    if (this.tipoBuffetForm.valid){
      this.solicitarConfirmacion()
    }
    else{
      Swal.fire('Datos Faltantes', 'Verifique que se estén ingresando todos los datos del Buffet', 'error')
    }
  }

  solicitarConfirmacion(): void{
    const tipoBuffetActualizado: TipoBuffet = this.tipoBuffetForm.value;
    let mensaje = `<b>Nombre</b>: ${tipoBuffetActualizado.nombre}<br>`;
     mensaje += `<b>Precio</b>: S/.${tipoBuffetActualizado.precioPorPlato}<br>`;
    Swal.fire({
      title: 'Confirmar Registro',
      html: '¿Desea registrar el servicio con los siguientes datos?<br>' + mensaje,
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      icon: 'question'
    }).then((result) => {
      if(result.isConfirmed){
        this.guardarCambios(tipoBuffetActualizado);
      }
    })
  }

  guardarCambios(tipoBuffetActualizado: TipoBuffet) {
    this.tipoBuffetService.actualizarTipoBuffet(this.tipoBuffetId, tipoBuffetActualizado).subscribe(
      (response) => {
        console.log('Tipo Buffet actualizado actualizado correctamente:', response);
        Swal.fire('Tipo Buffet Actualizado', 'El Buffet se ha sido actualizado correctamente', 'success')
        .then((result) => {
          this.regresarListadoBuffets();
        });


      },
      (error) => {
        console.error('Error al actualizar el servicio:', error);
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
