import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServicioService } from '../../../../services/servicio.service';
import { StorageService } from '../../../../services/storage.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Servicio } from '../../../../models/servicio.model';
import { Patterns } from '../../../../utils/patterns';
import { ProveedorService } from '../../../../services/proveedor.service';
import { Proveedor } from '../../../../models/proveedor.model';

@Component({
  selector: 'app-nuevo-servicio',
  templateUrl: './nuevo-servicio.component.html',
  styleUrl: './nuevo-servicio.component.css'
})
export class NuevoServicioComponent implements OnInit {
  serviceForm!: FormGroup;
  proveedores!: Proveedor[];
  passwordPattern: RegExp = Patterns.PASSWORD_PATTERN.getPattern();
  namePattern: RegExp = Patterns.NAME_PATTERN.getPattern();

  constructor(private fb: FormBuilder,
    private servicioService: ServicioService,
    private storageService: StorageService,
    private proveedorService: ProveedorService,
    private router: Router) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.obtenerProveedores();
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
      nombre: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      precio: ['', Validators.required],
      proveedor: ['', Validators.required]
    });
  }

  irNuevoProveedor(){
    this.router.navigate(['/dashboard', 'nuevo-proveedor'])
  }

  confirmarAgregarProvedor(){
    Swal.fire({
      title: 'Agregar Proveedor!',
      html: '¿Desea Agregar un nuevo Proveedor?<br>Los datos ingresados se perderán',
      icon: 'info',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí'
    })
    .then((response) => {
      if(response.isConfirmed){
        this.irNuevoProveedor()
      }
    });
  }

  obtenerProveedores(){
    this.proveedorService.obtenerProveedores().subscribe(
      (response: Proveedor[]) => {
        this.proveedores = response;
        console.log(this.proveedores)
      },
      (error) => {
        console.error('Error al obtener proveedor:', error);
        if (error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    )
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
    const proveedorSeleccionado = this.proveedores.find(proveedor => proveedor.nombre == this.serviceForm.value.proveedor);
    const nuevoServicio: Servicio = this.serviceForm.value;
    let mensaje = `<b>Nombre</b>: ${nuevoServicio.nombre}<br>`;
    mensaje += `<b>Precio</b>: ${nuevoServicio.precio}<br>`;
    mensaje += `<b>Proveedor</b>: ${proveedorSeleccionado?.nombre}<br>`;
    Swal.fire({
      title: 'Confirmar Registro',
      html: '¿Desea registrar el servicio con los siguientes datos?<br>' + mensaje,
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      icon: 'question'
    }).then((result) => {
      if(result.isConfirmed){
        delete this.serviceForm.value.proveedor;
        nuevoServicio.proveedorId = proveedorSeleccionado?.id;
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
