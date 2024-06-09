import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoEventoService } from '../../../../services/tipoEvento.service';
import { StorageService } from '../../../../services/storage.service';
import { TipoEvento } from '../../../../models/tipoEvento.model';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Patterns } from '../../../../utils/patterns';

@Component({
  selector: 'app-editar-tipo-evento',
  templateUrl: './editar-tipo-evento.component.html',
  styleUrl: './editar-tipo-evento.component.css'
})
export class EditarTipoEventoComponent implements OnInit{
  tipoEventoForm: FormGroup;
  tipoEventoId: number;
  tipoEvento!: TipoEvento;
  passwordPattern: RegExp = Patterns.PASSWORD_PATTERN.getPattern();
  namePattern: RegExp = Patterns.NAME_PATTERN.getPattern();


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private tipoEventoService: TipoEventoService,
    private storageService: StorageService
  ) {
    this.tipoEventoId = 0;
    this.tipoEventoForm = this.fb.group({});
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.tipoEventoId = this.route.snapshot.params['tevid'];
    this.obtenerSalon();
  }

  ngAfterViewInit(): void{
    this.storageService.comprobarSesion();
  }

  ngOnChanges(): void{
    this.storageService.comprobarSesion();
  }

  regresarListadoTiposEvento(){
    this.router.navigate(['/dashboard', 'tipo-evento']);
  }

  obtenerSalon() {
    this.tipoEventoService.obtenerTipoEventoPorId(this.tipoEventoId).subscribe({
      next: (data: TipoEvento) => {
        this.tipoEvento = data;
        this.tipoEventoForm.patchValue({
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
    this.tipoEventoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(this.namePattern)]],
    });
  }

  validarFormulario(){
    if (this.tipoEventoForm.valid){
      this.solicitarConfirmacion()
    }
    else{
      Swal.fire('Datos Faltantes', 'Verifique que se estén ingresando todos los datos del Buffet', 'error')
    }
  }

  solicitarConfirmacion(): void{
    const tipoEventoActualizado: TipoEvento = this.tipoEventoForm.value;
    let mensaje = `<b>Nombre</b>: ${tipoEventoActualizado.nombre}<br>`;
    Swal.fire({
      title: 'Confirmar Registro',
      html: '¿Desea registrar el tipo de evento con los siguientes datos?<br>' + mensaje,
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      icon: 'question'
    }).then((result) => {
      if(result.isConfirmed){
        this.guardarCambios(tipoEventoActualizado);
      }
    })
  }

  guardarCambios(tipoEventoActualizado: TipoEvento) {
    this.tipoEventoService.actualizarTipoEvento(this.tipoEventoId, tipoEventoActualizado).subscribe(
      (response) => {
        console.log('Tipo Evento actualizado actualizado correctamente:', response);
        Swal.fire('Tipo Evento Actualizado', 'El Evento se ha sido actualizado correctamente', 'success')
        .then((result) => {
          this.regresarListadoTiposEvento();
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
