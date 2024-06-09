import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoBuffetService } from '../../../../services/tipoBuffet.service';
import { StorageService } from '../../../../services/storage.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TipoBuffet } from '../../../../models/tipoBuffet.model';
import { Patterns } from '../../../../utils/patterns';

@Component({
  selector: 'app-nuevo-tipo-buffet',
  templateUrl: './nuevo-tipo-buffet.component.html',
  styleUrl: './nuevo-tipo-buffet.component.css'
})
export class NuevoTipoBuffetComponent implements OnInit{
  tipoBuffetForm!: FormGroup;
  passwordPattern: RegExp = Patterns.PASSWORD_PATTERN.getPattern();
  namePattern: RegExp = Patterns.NAME_PATTERN.getPattern();

  constructor(private fb: FormBuilder,
    private tipoBuffetService: TipoBuffetService,
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

  regresarListadoBuffets(){
    this.router.navigate(['/dashboard', 'tipo-buffet']);
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
    const nuevoTipoBuffet: TipoBuffet = this.tipoBuffetForm.value;
    let mensaje = `<b>Nombre</b>: ${nuevoTipoBuffet.nombre}<br>`;
     mensaje += `<b>Precio por Plato</b>: S/.${nuevoTipoBuffet.precioPorPlato}<br>`;
    Swal.fire({
      title: 'Confirmar Registro',
      html: '¿Desea registrar el buffet con los siguientes datos?<br>' + mensaje,
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      icon: 'question'
    }).then((result) => {
      if(result.isConfirmed){
        this.guardarServicio(nuevoTipoBuffet)
      }
    })
  }

  guardarServicio(nuevoTipoBuffet: TipoBuffet) {
    this.tipoBuffetService.crearTipoBuffet(nuevoTipoBuffet).subscribe(
      (response) => {
        console.log('Buffet creado correctamente:', response);
        Swal.fire('Buffet Creado!', 'El Buffet ha sido registrado exitosamente', 'success')
          .then((result) => {
            this.regresarListadoBuffets()
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
