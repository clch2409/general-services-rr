import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServicioService } from '../../../../services/servicio.service';
import { StorageService } from '../../../../services/storage.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Servicio } from '../../../../models/servicio.model';

@Component({
  selector: 'app-nuevo-servicio',
  templateUrl: './nuevo-servicio.component.html',
  styleUrl: './nuevo-servicio.component.css'
})
export class NuevoServicioComponent implements OnInit {
  serviceForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private servicioService: ServicioService,
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

  regresarListadoServicios(){
    this.router.navigate(['/dashboard', 'servicios']);
  }

  inicializarFormulario() {
    this.serviceForm = this.fb.group({
      nombre: ['', Validators.required],
      precio: ['', Validators.required],
    });
  }

  validarFormulario(){
    if (this.serviceForm.valid){
      this.solicitarConfirmacion()
    }
    else{
      Swal.fire('Datos Faltantes', 'Verifique que se estén ingresando todos los datos del Servicio', 'error')
    }
  }

  solicitarConfirmacion(): void{
    const nuevoServicio: Servicio = this.serviceForm.value;
    let mensaje = `<b>Nombre</b>: ${nuevoServicio.nombre}<br>`;
     mensaje += `<b>Precio</b>: ${nuevoServicio.precio}<br>`;
    Swal.fire({
      title: 'Confirmar Registro',
      html: '¿Desea registrar el servicio con los siguientes datos?<br>' + mensaje,
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      icon: 'question'
    }).then((result) => {
      if(result.isConfirmed){
        this.guardarServicio(nuevoServicio)
      }
    })
  }

  guardarServicio(nuevoServicio: Servicio) {
    this.servicioService.crearServicio(nuevoServicio).subscribe(
      (response) => {
        console.log('Servicio creado correctamente:', response);
        Swal.fire('Servicio Creado!', 'El servicio ha sido registrado exitosamente', 'success')
          .then((result) => {
            this.regresarListadoServicios()
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
