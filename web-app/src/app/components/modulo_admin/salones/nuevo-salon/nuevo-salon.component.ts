import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalService } from '../../../../services/local.service';
import { Local } from '../../../../models/local.model';
import Swal from 'sweetalert2';
import { StorageService } from '../../../../services/storage.service';
import { Router } from '@angular/router';
import { Dia } from '../../../../models/dia.model';
import { LocalDia } from '../../../../models/local.dia.model';
import { Patterns } from '../../../../utils/patterns';

@Component({
  selector: 'app-nuevo-salon',
  templateUrl: './nuevo-salon.component.html',
  styleUrls: ['./nuevo-salon.component.css']
})
export class NuevoSalonComponent implements OnInit {
  localForm!: FormGroup;
  pricesForm!: FormGroup;

  passwordPattern: RegExp = Patterns.PASSWORD_PATTERN.getPattern();
  namePattern: RegExp = Patterns.NAME_PATTERN.getPattern();
  directionPattern: RegExp = Patterns.DIRECTION_PATTERN.getPattern();
  descriptionPattern: RegExp = Patterns.DESCRIPTION_PATTERN.getPattern();

  constructor(private fb: FormBuilder, private localService: LocalService, private storageService: StorageService, private router: Router) {}

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  ngAfterViewInit(): void{
    this.storageService.comprobarSesion();
  }

  ngOnChanges(): void{
    this.storageService.comprobarSesion();
  }

  inicializarFormulario() {
    this.localForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      descripcion: ['', [Validators.required, Validators.pattern(this.descriptionPattern)]],
      direccion: ['', [Validators.required, Validators.pattern(this.directionPattern)]],
      aforoMinimo: ['', Validators.required],
      aforoMaximo: ['', Validators.required],
      // fechaInactivacion: ['', Validators.required],
    });
    this.pricesForm = this.fb.group({
      domingo: ['', Validators.required],
      lunes: ['', Validators.required],
      martes: ['', Validators.required],
      miercoles: ['', Validators.required],
      jueves: ['', Validators.required],
      viernes: ['', Validators.required],
      sabado: ['', Validators.required],

    })
  }

  validarFormulario(){
    if (this.localForm.valid){
      this.solicitarConfirmacion()
    }
    else if(this.localForm.valid){
      Swal.fire('Precios no Ingresados', 'Por favor, ingrese los precios completos.', 'error');
    }
    else{
      Swal.fire('Datos Faltantes', 'Verifique que se estén ingresando todos los datos del Local', 'error')
    }
  }

  solicitarConfirmacion(): void{
    const nuevoLocal: Local = this.localForm.value;
    let mensaje = `<b>Nombre</b>: ${nuevoLocal.nombre}<br>`;
     mensaje += `<b>Descripcion</b>: ${nuevoLocal.descripcion}<br>`;
     mensaje += `<b>Aforo Mínimo</b>: ${nuevoLocal.aforoMinimo} personas<br>`;
     mensaje += `<b>Aforo Máximo</b>: ${nuevoLocal.aforoMaximo} personas<br>`;
    Swal.fire({
      title: 'Confirmar Registro',
      html: '¿Desea registrar el local con los siguientes datos?<br>' + mensaje,
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      icon: 'question'
    }).then((result) => {
      if(result.isConfirmed){
        this.confirmarPrecios(nuevoLocal)
      }
    })
  }

  confirmarPrecios(nuevoLocal: Local){
    let mensaje = '¿Dese ingresar los siguientes precios?<br>';
    const preciosForm = this.pricesForm.value;
    const nombresDias = [...Object.keys(preciosForm)];
    const precios: number[] = [];
    Object.values(preciosForm).forEach(precio => precios.push(parseInt(`${precio}`)));
    nombresDias.forEach((nombre, index) => {
      mensaje += `-${this.convertirPrimeraLetraEnMayuscula(nombre)}: S/.${precios[index]}<br>`
    })
    Swal.fire({
      title: 'Confirmar Registro',
      html: mensaje,
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      icon: 'question'
    }).then((result) => {
      if(result.isConfirmed){
        this.guardarLocal(nuevoLocal, precios)
      }
    })
  }

  guardarLocal(nuevoLocal: Local, precios: number[]) {
    this.localService.crearLocal(nuevoLocal).subscribe(
      (response) => {
        console.log('Local creado correctamente:', response);
        this.guardarPrecios(response.id!, precios);
      },
      (error) => {
        console.error('Error al crear el local:', error);
        if (error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    );

  }

  guardarPrecios(idLocal: number, precios: number[]){
    this.localService.agregarTodosLosPreciosAlLocal(idLocal, precios).subscribe(
      (response) => {
        console.log('Creado exitosamente los precios', response);
        Swal.fire({
          title: 'Local Creado',
          html: 'El local se ha creado exitosamente. Será redirigido al listado de locales.',
          showCancelButton: true,
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6',
          icon: 'success'
        })
          .then((result) => {
            this.regresarListadoLocales();
        });
      },
      (error) => {
        console.error('Error al crear los precios', error);

      }
    )
  }

  confirmarRegresoListadoLocales(){
    Swal.fire({
      title: 'Confirmar Regreso',
      html: '¿Desea regresar al listado de locales? </br> Se perderán todos los cambios que no hayas guardado.',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      icon: 'question'
    }).then((result) => {
      if(result.isConfirmed){
        this.regresarListadoLocales();
      }
    })
  }

  regresarListadoLocales(){
    this.router.navigate(['/dashboard', 'salones']);
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

  ordenarPreciosMayorMenor(dias: Dia[]){
    return dias.sort((a,b) => a.id! - b.id!)
  }
}
