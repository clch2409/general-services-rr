import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InsumoService } from '../../../../services/insumo.service';
import { Insumo } from '../../../../models/insumo.model';
import { Proveedor } from '../../../../models/proveedor.model';
import { ProveedorInsumo } from '../../../../models/proveedor.insumo.model';
import { ProveedorService } from '../../../../services/proveedor.service';
import Swal from 'sweetalert2';
import { StorageService } from '../../../../services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nuevo-insumo',
  templateUrl: './nuevo-insumo.component.html',
  styleUrls: ['./nuevo-insumo.component.css']
})
export class NuevoInsumoComponent implements OnInit {
  insumoForm!: FormGroup;
  proveedores!: Proveedor[]

  constructor(private fb: FormBuilder,
    private insumoService: InsumoService,
    private proveedorService: ProveedorService,
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerProveedores();
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.insumoForm = this.fb.group({
      nombre: ['', Validators.required],
      precio: ['', Validators.required],
      proveedor: ['', Validators.required],
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
        console.error('Error al obtener proveedores:', error);
        if (error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    )
  }

  validarConfirmacion(){
    if (!this.insumoForm.valid){
      Swal.fire('Datos Faltantes!', 'Ingrese todos datos del insumo', 'error');
    }
    else{
      this.confirmarGuardadoInsumo();
    }
  }

  confirmarGuardadoInsumo(){
    const insumoForm = this.insumoForm.value;
    console.log(insumoForm)
    const proveedorSeleccionado = this.proveedores.find(proveedor => proveedor.nombre == insumoForm.proveedor);
    let mensaje = `-Nombre: ${insumoForm.nombre}<br>`;
    mensaje += `-Precio: ${insumoForm.precio}<br>`;
    mensaje += `-Proveedor: ${proveedorSeleccionado?.nombre}<br>`;
    Swal.fire({
      title: 'Crear Insumo!',
      html: 'Desea registrar los siguientes datos del insumo?<br>' + mensaje,
      icon: 'question',
      confirmButtonText: 'Sí',
      showCancelButton: true,
      cancelButtonText: 'No'
    }).then(result => {
      if (result.isConfirmed){
        const nuevoInsumo = new Insumo();
        nuevoInsumo.nombre = insumoForm.nombre;
        nuevoInsumo.precio = insumoForm.precio;
        nuevoInsumo.proveedorId = proveedorSeleccionado?.id;
        this.guardarInsumo(nuevoInsumo)
      }
    });
  }

  guardarInsumo(nuevoInsumo: Insumo) {
    this.insumoService.crearInsumo(nuevoInsumo).subscribe(
      (response) => {
        console.log('Insumo creado correctamente:', response);
        Swal.fire('Insumo Creado!', 'El insumo ha sido registrado correctamente!', 'success')
        .then(result => this.regresarListadoInsumos());
      },
      (error) => {
        console.error('Error al crear el insumo:', error);
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

  regresarListadoInsumos(){
    this.router.navigate(['/dashboard', 'insumos'])
  }
}

