import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Servicio } from '../../../../models/servicio.model';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioService } from '../../../../services/servicio.service';
import { StorageService } from '../../../../services/storage.service';
import { Patterns } from '../../../../utils/patterns';
import { Proveedor } from '../../../../models/proveedor.model';
import { ProveedorService } from '../../../../services/proveedor.service';

@Component({
  selector: 'app-editar-servicio',
  templateUrl: './editar-servicio.component.html',
  styleUrl: './editar-servicio.component.css'
})
export class EditarServicioComponent implements OnInit{
  servicioForm: FormGroup;
  servicioId: number;
  servicio!: Servicio;
  proveedores!: Proveedor[];
  passwordPattern: RegExp = Patterns.PASSWORD_PATTERN.getPattern();
  namePattern: RegExp = Patterns.NAME_PATTERN.getPattern();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private servicioService: ServicioService,
    private storageService: StorageService,
    private proveedorService: ProveedorService
  ) {
    this.servicioId = 0;
    this.servicioForm = this.fb.group({});
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.servicioId = this.route.snapshot.params['serid'];
    this.obtenerServicio();
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

  obtenerServicio() {
    this.servicioService.obtenerServicioPorId(this.servicioId).subscribe({
      next: (data: Servicio) => {
        this.servicio = data;
        this.servicioForm.patchValue({
          ...data,
          proveedor: data.proveedorId,
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
    this.servicioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      precio: ['', Validators.required],
      proveedor: ['', Validators.required]
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


  irNuevoProveedor(){
    this.router.navigate(['/dashboard', 'nuevo-proveedor'])
  }

  validarFormulario(){
    if (this.servicioForm.valid){
      this.solicitarConfirmacion()
    }
    else{
      Swal.fire('Datos Faltantes', 'Verifique que se estén ingresando todos los datos del Local', 'error')
    }
  }

  solicitarConfirmacion(): void{
    const proveedorSeleccionado = this.proveedores.find(proveedor => proveedor.id == this.servicioForm.value.proveedor);
    const servicioActualizado: Servicio = this.servicioForm.value;
    let mensaje = `<b>Nombre</b>: ${servicioActualizado.nombre}<br>`;
     mensaje += `<b>Precio</b>: S/.${servicioActualizado.precio}<br>`;
     mensaje += `<b>Proveedor</b>: S/.${proveedorSeleccionado?.nombre}<br>`;
    Swal.fire({
      title: 'Confirmar Actualización',
      html: '¿Desea registrar el servicio con los siguientes datos?<br>' + mensaje,
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      icon: 'question'
    }).then((result) => {
      if(result.isConfirmed){
        delete servicioActualizado.proveedor;
        servicioActualizado.proveedorId = proveedorSeleccionado?.id;
        this.guardarCambios(servicioActualizado);
      }
    })
  }

  guardarCambios(servicioActualizado: Servicio) {
    this.servicioService.actualizarServicio(this.servicioId, servicioActualizado).subscribe(
      (response) => {
        console.log('Servicio actualizado actualizado correctamente:', response);
        Swal.fire('Servicio Actualizado', 'El servicio se ha sido actualizado correctamente', 'success')
        .then((result) => {
          this.regresarListadoServicios();
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
