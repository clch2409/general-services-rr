import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProveedorService } from '../../../../services/proveedor.service';
import { Proveedor } from '../../../../models/proveedor.model';
import { StorageService } from '../../../../services/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-proveedores',
  templateUrl: './editar-proveedores.component.html',
  styleUrls: ['./editar-proveedores.component.css']
})
export class EditarProveedoresComponent implements OnInit {
  proveedorForm: FormGroup;
  proveedorId: number;
  proveedor: Proveedor = new Proveedor();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private proveedorService: ProveedorService,
    private storageService: StorageService,
  ) {
    this.proveedorId = 0;
    this.proveedorForm = this.fb.group({});
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.proveedorId = this.route.snapshot.params['provid'];
    this.obtenerProveedor();
  }

  ngAfterViewInit(): void{
    this.storageService.comprobarSesion();
  }

  ngOnChanges(): void{
    this.storageService.comprobarSesion();
  }

  obtenerProveedor() {
    this.proveedorService.obtenerProveedorPorId(this.proveedorId).subscribe({
      next: (data: any) => {
        this.proveedor = data.proveedor;
        const fechaContrato = new Date(data.fechaContrato).toISOString().substring(0, 10);
        this.proveedorForm.patchValue({
          ...data.proveedor,
          fechaContrato
        });
      },
      error: err => {
        console.error('Error al obtener proveedor:', err);
      }
    });
  }

  inicializarFormulario() {
    this.proveedorForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      fechaContrato: ['', Validators.required]
    });
  }

  validarFormulario(){
    if (this.proveedorForm.valid){
      this.solicitarConfirmacion()
    }
    else{
      Swal.fire('Datos Faltantes', 'Verifique que se estén ingresando todos los datos del Insumo', 'error')
    }
  }

  solicitarConfirmacion(): void{
    const proveedorActualizado: Proveedor = this.proveedorForm.value;
    let mensaje = `<b>Nombre</b>: ${proveedorActualizado.nombre}<br>`;
     mensaje += `<b>Email</b>: ${proveedorActualizado.email}<br>`;
     mensaje += `<b>Telefono</b>: ${proveedorActualizado.telefono}<br>`;
     mensaje += `<b>Dirección</b>: ${proveedorActualizado.direccion}<br>`;
     mensaje += `<b>Fecha Contrato</b>: ${proveedorActualizado.fechaContrato}<br>`;
    Swal.fire({
      title: 'Confirmar Actualización',
      html: '¿Desea actualizar el proveedor con los siguientes datos?<br>' + mensaje,
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      icon: 'question'
    }).then((result) => {
      if(result.isConfirmed){
        this.guardarCambios(proveedorActualizado);
      }
    })
  }

  guardarCambios(proveedorActualizado: Proveedor) {
    this.proveedorService.actualizarProveedor(this.proveedorId, proveedorActualizado).subscribe(
      (response) => {
        console.log('Proveedor actualizado correctamente:', response);
        Swal.fire('Proveedor Actualizado!', 'El proveedor ha sido actualizado correctamente', 'success')
        .then(result => this.regresarListadoProveedores());
      },
      (error) => {
        console.error('Error al actualizar el proveedor:', error);
        if(error.status === 401){
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
