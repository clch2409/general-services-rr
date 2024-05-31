import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalService } from '../../../../services/local.service';
import { Local } from '../../../../models/local.model';
import Swal from 'sweetalert2';
import { StorageService } from '../../../../services/storage.service';
import { Dia } from '../../../../models/dia.model';
import { PayloadUpdateLocal } from '../../../../models/payloadUpdateLocal';

@Component({
  selector: 'app-editar-salones',
  templateUrl: './editar-salones.component.html',
  styleUrls: ['./editar-salones.component.css']
})
export class EditarSalonesComponent implements OnInit {
  salonForm: FormGroup;
  pricesForm: FormGroup;
  salonId: number;
  preciosSalon!: Dia[];
  salon: Local = new Local();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private localService: LocalService,
    private storageService: StorageService
  ) {
    this.salonId = 0;
    this.salonForm = this.fb.group({});
    this.pricesForm = this.fb.group({});
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.salonId = this.route.snapshot.params['salid'];
    this.obtenerSalon();
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

  obtenerSalon() {
    this.localService.obtenerLocalPorId(this.salonId).subscribe({
      next: (data: PayloadUpdateLocal) => {

        this.salon = data.local!;
        console.log(data.local?.precios)
        this.preciosSalon = data.local?.precios!;
        if(data.fechaInactivacion){
          const fechaInactivacion = new Date(data.fechaInactivacion).toISOString().substring(0, 10);
          this.salonForm.patchValue({
            ...data.local,
            fechaInactivacion
          });
        }
        else{
          this.salonForm.patchValue({
            ...data.local,
          });
        }
        this.colocarDias(this.preciosSalon)
      },
      error: err => {
        console.error('Error al obtener salón:', err);
        if (err.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    });
  }

  inicializarFormulario() {
    this.salonForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      direccion: ['', Validators.required],
      aforoMinimo: ['', Validators.required],
      aforoMaximo: ['', Validators.required],
      fechaInactivacion: ['', Validators.required],
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
    if (this.salonForm.valid){
      this.solicitarConfirmacion()
    }
    else{
      Swal.fire('Datos Faltantes', 'Verifique que se estén ingresando todos los datos del Local', 'error')
    }
  }

  solicitarConfirmacion(): void{
    const localActualizado: Local = this.salonForm.value;
    let mensaje = `<b>Nombre</b>: ${localActualizado.nombre}<br>`;
     mensaje += `<b>Aforo Máximo</b>: ${localActualizado.aforoMinimo} personas<br>`;
     mensaje += `<b>Aforo Máximo</b>: ${localActualizado.aforoMaximo} personas<br>`;
     mensaje += `<b>Fecha Inactivacion</b>: ${localActualizado.fechaInactivacion ? localActualizado.fechaInactivacion : 'Sin Fecha'}<br>`;
    Swal.fire({
      title: 'Confirmar Registro',
      html: '¿Desea registrar el local con los siguientes datos?<br>' + mensaje,
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      icon: 'question'
    }).then((result) => {
      if(result.isConfirmed){
        this.guardarCambios(localActualizado);
      }
    })
  }

  guardarCambios(localActualizado: Local) {
    this.localService.actualizarLocal(this.salonId, localActualizado).subscribe(
      (response) => {
        console.log('Salón actualizado correctamente:', response);
        Swal.fire('Salón Actualizado', 'El salón se ha sido actualizado correctamente', 'success')
        .then((result) => {
          this.regresarListadoLocales();
        });


      },
      (error) => {
        console.error('Error al actualizar el salón:', error);
        if (error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    );
  }

  colocarDias(dias: Dia[]){
    let objeto = {
    }
    dias.forEach(dia => {
      Object.defineProperty(objeto, dia.nombre!, {
        value: dia.LocalDia?.precioLocal,
        enumerable: true
      })
    })
    this.pricesForm.patchValue(objeto)
  }

  cerrarSesion(){
    this.storageService.cerrarSesion();
    this.storageService.volverMenuPrincipal();
  }
}
