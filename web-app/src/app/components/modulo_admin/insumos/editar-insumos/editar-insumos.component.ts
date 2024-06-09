import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InsumoService } from '../../../../services/insumo.service';
import { Insumo } from '../../../../models/insumo.model';
import Swal from 'sweetalert2';
import { StorageService } from '../../../../services/storage.service';
import { Patterns } from '../../../../utils/patterns';

@Component({
  selector: 'app-editar-insumos',
  templateUrl: './editar-insumos.component.html',
  styleUrls: ['./editar-insumos.component.css']
})
export class EditarInsumosComponent implements OnInit {
  insumoForm: FormGroup;
  insumoId: number;
  insumo: Insumo = new Insumo();
  passwordPattern: RegExp = Patterns.PASSWORD_PATTERN.getPattern();
  namePattern: RegExp = Patterns.NAME_PATTERN.getPattern();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private insumoService: InsumoService,
    private storageService: StorageService
  ) {
    this.insumoId = 0;
    this.insumoForm = this.fb.group({});
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.insumoId = this.route.snapshot.params['insid'];
    this.obtenerInsumo();
  }

  ngAfterViewInit(): void{
    this.storageService.comprobarSesion();
  }

  ngOnChanges(): void{
    this.storageService.comprobarSesion();
  }

  obtenerInsumo() {
    this.insumoService.obtenerInsumoPorId(this.insumoId).subscribe({
      next: (data: Insumo) => {
        this.insumo = data;
        console.log(data)
        this.insumoForm.patchValue({
          ...data,
          proveedor: data.proveedor?.nombre
        });
      },
      error: err => {
        console.error('Error al obtener insumo:', err);
        if(err.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    });
  }

  inicializarFormulario() {
    this.insumoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      precio: ['', Validators.required],
      proveedor: ['', Validators.required],
    });
  }

  validarFormulario(){
    if (this.insumoForm.valid){
      this.solicitarConfirmacion()
    }
    else{
      Swal.fire('Datos Faltantes', 'Verifique que se estén ingresando todos los datos del Insumo', 'error')
    }
  }

  solicitarConfirmacion(): void{
    delete this.insumoForm.value.proveedor;
    const insumoActualizado: Insumo = this.insumoForm.value;
    let mensaje = `<b>Nombre</b>: ${insumoActualizado.nombre}<br>`;
     mensaje += `<b>Precio</b>: S/. ${insumoActualizado.precio}<br>`;
    Swal.fire({
      title: 'Confirmar Actualización',
      html: '¿Desea actualizar el insumo con los siguientes datos?<br>' + mensaje,
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      icon: 'question'
    }).then((result) => {
      if(result.isConfirmed){
        this.guardarCambios(insumoActualizado);
      }
    })
  }

  guardarCambios(insumoActualizado: Insumo) {
    this.insumoService.actualizarInsumo(this.insumoId, insumoActualizado).subscribe(
      (response) => {
        console.log('Insumo actualizado correctamente:', response);
        Swal.fire('Insumo Actualizado!', 'El insumo ha sido actualizado correctamente', 'success')
        .then(data => this.regresarListaInsumos());
      },
      (error) => {
        console.error('Error al actualizar el insumo:', error);
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


  regresarListaInsumos(){
    this.router.navigate(['/dashboard', 'insumos'])
  }

}
