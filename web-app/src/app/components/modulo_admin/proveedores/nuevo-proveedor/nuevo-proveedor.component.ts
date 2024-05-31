import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProveedorService } from '../../../../services/proveedor.service';
import { Proveedor } from '../../../../models/proveedor.model';
import Swal from 'sweetalert2';
import { StorageService } from '../../../../services/storage.service';
import { Patterns } from '../../../../utils/patterns';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nuevo-proveedor',
  templateUrl: './nuevo-proveedor.component.html',
  styleUrls: ['./nuevo-proveedor.component.css']
})
export class NuevoProveedorComponent implements OnInit {
  proveedorForm!: FormGroup;
  phonePattern = new RegExp(Patterns.PHONE_PATTERN.getPattern());
  namePattern = new RegExp(Patterns.NAME_PATTERN.getPattern());

  constructor(
    private fb: FormBuilder,
    private proveedorService: ProveedorService,
    private storageService: StorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.proveedorForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(this.phonePattern)]],
      direccion: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      fechaContrato: ['', Validators.required],
    });
  }

  validarConfirmacion(){
    if (!this.proveedorForm.valid){
      Swal.fire('Datos Faltantes!', 'Ingrese todos datos del proveedor', 'error');
    }
    else{
      this.confirmarGuardadoProveedor();
    }
  }

  confirmarGuardadoProveedor(){
    const proveedorForm = this.proveedorForm.value;
    let mensaje = `-Nombre: ${proveedorForm.nombre}<br>`;
    mensaje += `-Email: ${proveedorForm.email}<br>`;
    mensaje += `-Telefono: ${proveedorForm.telefono}<br>`;
    mensaje += `-Direccion: ${proveedorForm.direccion}<br>`;
    mensaje += `-Fecha de Contratación: ${proveedorForm.fechaContrato}<br>`;
    Swal.fire({
      title: 'Crear Proveedor',
      html: 'Desea registrar los siguientes datos del proveedor?<br>' + mensaje,
      icon: 'question',
      confirmButtonText: 'Sí',
      showCancelButton: true,
      cancelButtonText: 'No'
    }).then(result => {
      if (result.isConfirmed){
        const nuevoProveedor: Proveedor = proveedorForm;
        this.guardarProveedor(nuevoProveedor)
      }
    });
  }

  guardarProveedor(nuevoProveedor: Proveedor) {
    this.proveedorService.crearProveedor(nuevoProveedor).subscribe(
      (response) => {
        console.log('Proveedor creado correctamente:', response);
      },
      (error) => {
        console.error('Error al crear el proveedor:', error);
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

  regresarListadoProveedores(){
    this.router.navigate(['/dashboard', 'proveedores'])
  }
}
