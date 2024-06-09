import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoBuffetService } from '../../../../services/tipoBuffet.service';
import { StorageService } from '../../../../services/storage.service';
import { Router } from '@angular/router';
import { TipoEventoService } from '../../../../services/tipoEvento.service';
import Swal from 'sweetalert2';
import { TipoEvento } from '../../../../models/tipoEvento.model';
import { Patterns } from '../../../../utils/patterns';

@Component({
  selector: 'app-nuevo-tipo-evento',
  templateUrl: './nuevo-tipo-evento.component.html',
  styleUrl: './nuevo-tipo-evento.component.css'
})
export class NuevoTipoEventoComponent implements OnInit{
  tipoEventoForm!: FormGroup;
  passwordPattern: RegExp = Patterns.PASSWORD_PATTERN.getPattern();
  namePattern: RegExp = Patterns.NAME_PATTERN.getPattern();


  constructor(private fb: FormBuilder,
    private tipoEventoService: TipoEventoService,
    private storageService: StorageService,
    private router: Router) {}

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  ngAfterViewInit(): void{
    this.storageService.comprobarSesion();
  }

  ngOnChanges(): void{
    this.storageService.comprobarSesion();
  }

  regresarListadoTipoEvento(){
    this.router.navigate(['/dashboard', 'tipo-evento']);
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
      Swal.fire('Datos Faltantes', 'Verifique que se estén ingresando todos los datos del Servicio', 'error')
    }
  }

  solicitarConfirmacion(): void{
    const nuevoTipoEvento: TipoEvento = this.tipoEventoForm.value;
    let mensaje = `<b>Nombre</b>: ${nuevoTipoEvento.nombre}<br>`;
    Swal.fire({
      title: 'Confirmar Registro',
      html: '¿Desea registrar el tipo de evento con los siguientes datos?<br>' + mensaje,
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      icon: 'question'
    }).then((result) => {
      if(result.isConfirmed){
        this.guardarServicio(nuevoTipoEvento)
      }
    })
  }

  guardarServicio(nuevoTipoEvento: TipoEvento) {
    this.tipoEventoService.crearTipoEvento(nuevoTipoEvento).subscribe(
      (response) => {
        console.log('Tipo Evento creado correctamente:', response);
        Swal.fire('Tipo Evento Creado!', 'El Tipo Evento ha sido registrado exitosamente', 'success')
          .then((result) => {
            this.regresarListadoTipoEvento()
        });
      },
      (error) => {
        console.error('Error al crear el local:', error);
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

  convertirPrimeraLetraEnMayuscula(string: String) {
    if (typeof string !== 'string' || string.length === 0) {
      return '';
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
