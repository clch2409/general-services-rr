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
  precioLunes!: number;
  precioMartes!: number;
  precioMiercoles!: number;
  precioJueves!: number;
  precioViernes!: number;
  precioSabado!: number;
  precioDomingo!: number;
  
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

  regresarListadoLocales(){
    this.router.navigate(['/dashboard', 'salones']);
  }

  inicializarFormulario() {
    this.localForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      descripcion: ['', [Validators.required, Validators.pattern(this.descriptionPattern)]],
      direccion: ['', [Validators.required, Validators.pattern(this.directionPattern)]],
      aforoMinimo: ['', Validators.required],
      aforoMaximo: ['', Validators.required],
      fechaInactivacion: ['', Validators.required],
    });
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
      icon: 'question'
    }).then((result) => {
      if(result.isConfirmed){
        this.confirmarPrecios(nuevoLocal)
      }
    })
  }

  confirmarPrecios(nuevoLocal: Local){
    const preciosForm = document.querySelectorAll('.precio');
    const preciosObjetos: Dia[] = []
    let mensaje = '¿Dese ingresar los siguientes precios?<br>';
    preciosForm.forEach(elemento => {
      const dia = new Dia();
      dia.LocalDia = new LocalDia();
      if (elemento.id === 'domingo'){
        dia.id = 1;
        dia.LocalDia.precioLocal = this.precioDomingo;
      }
      if (elemento.id === 'lunes'){
        dia.id = 2;
        dia.LocalDia.precioLocal = this.precioLunes;
      }
      if (elemento.id === 'martes'){
        dia.id = 3;
        dia.LocalDia.precioLocal = this.precioMartes;
      }
      if (elemento.id === 'miercoles'){
        dia.id = 4;
        dia.LocalDia.precioLocal = this.precioMiercoles;
      }
      if (elemento.id === 'jueves'){
        dia.id = 5;
        dia.LocalDia.precioLocal = this.precioJueves;
      }
      if (elemento.id === 'viernes'){
        dia.id = 6;
        dia.LocalDia.precioLocal = this.precioViernes;
      }
      if (elemento.id === 'sabado'){
        dia.id = 7;
        dia.LocalDia.precioLocal = this.precioSabado;
      }
      dia.nombre = this.convertirPrimeraLetraEnMayuscula(elemento.id);
      preciosObjetos.push(dia);
    })
    const preciosOrdenado: Dia[] = this.ordenarPreciosMayorMenor(preciosObjetos);
    preciosOrdenado.forEach(precio => {
      mensaje += `-${precio.nombre}: S/.${precio.LocalDia?.precioLocal}<br>`;
    })
    Swal.fire({
      title: 'Confirmar Registro',
      html: mensaje,
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      icon: 'question'
    }).then((result) => {
      if(result.isConfirmed){
        this.guardarLocal(nuevoLocal, preciosOrdenado)
      }
    })
  }

  guardarLocal(nuevoLocal: Local, precios: Dia[]) {
    this.localService.crearLocal(nuevoLocal).subscribe(
      (response) => {
        console.log('Local creado correctamente:', response);
        Swal.fire('Local Creado!', 'El local ha sido registrado exitosamente', 'success')
          .then((result) => {
          this.guardarPrecios(response.id!, precios);
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

  guardarPrecios(idLocal: number, precios: Dia[]){
    const preciosNumeros: number[] = []
    precios.forEach(dia => {
      preciosNumeros.push(dia.LocalDia?.precioLocal!);
    })
    this.localService.agregarTodosLosPreciosAlLocal(idLocal, preciosNumeros).subscribe(
      (response) => {
        console.log('Creado exitosamente los precios', response);
        this.regresarListadoLocales();
      },
      (error) => {
        console.error('Error al crear los precios', error);

      }
    )
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
