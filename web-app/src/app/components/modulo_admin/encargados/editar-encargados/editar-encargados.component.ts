import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EncargadoSalon } from '../../../../models/encargadoSalon.model';
import { EncargadoSalonService } from '../../../../services/encargadoSalon.service';
import { StorageService } from '../../../../services/storage.service';
import Swal from 'sweetalert2';
import { Usuario } from '../../../../models/usuario.model';
import { Patterns } from '../../../../utils/patterns';

@Component({
  selector: 'app-editar-encargados',
  templateUrl: './editar-encargados.component.html',
  styleUrls: ['./editar-encargados.component.css']
})
export class EditarEncargadosComponent implements OnInit {
  encargadoForm: FormGroup;
  usuarioForm!: FormGroup;
  encargadoId: number;
  encargado!: EncargadoSalon;
  passwordPattern: RegExp = Patterns.PASSWORD_PATTERN.getPattern();
  dniPattern: RegExp = Patterns.DNI_PATTERN.getPattern();
  phonePattern: RegExp = Patterns.PHONE_PATTERN.getPattern();
  namePattern: RegExp = Patterns.NAME_PATTERN.getPattern();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private encargadoService: EncargadoSalonService,
    private storageService: StorageService
  ) {
    this.encargadoId = 0;
    this.encargadoForm = this.fb.group({});
    this.encargadoForm = this.fb.group({});
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.encargadoId = this.route.snapshot.params['encid'];
    this.obtenerEncargado();
  }

  ngAfterViewInit(): void{
    this.storageService.comprobarSesion();
  }

  ngOnChanges(): void{
    this.storageService.comprobarSesion();
  }

  regresarListadoEncargados(){
    this.router.navigate(['/dashboard', 'encargados'])
  }

  obtenerEncargado() {
    this.encargadoService.obtenerEncargadoSalonPorId(this.encargadoId).subscribe({
      next: (data: any) => {
        this.encargado = data.encargado;
        this.encargadoForm.patchValue({
          ...this.encargado,
          fechaContratacion: new Date(data.fechaContratacion).toISOString().substring(0, 10),
        });
        this.usuarioForm.patchValue({email: this.encargado.usuario?.email});
      },
      error: err => {
        console.error('Error al obtener encargado:', err);
        if(err.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    });
  }

  inicializarFormulario() {
    this.encargadoForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      apPaterno: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      apMaterno: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      telefono: ['', [Validators.required, Validators.pattern(this.phonePattern)]],
      dni: ['', [Validators.required, Validators.pattern(this.dniPattern)]],
      fechaContratacion: ['', Validators.required]
    });
    this.usuarioForm= this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }

  validarFormulario(){
    if (this.encargadoForm.valid && this.usuarioForm.valid){
      this.solicitarConfirmacion()
    }
    else{
      Swal.fire('Datos Faltantes', 'Verifique que se estén ingresando todos los datos del Cliente', 'error')
    }
  }

  solicitarConfirmacion(): void{
    delete this.usuarioForm.value.repetir_contrasena;
    const usuarioActualizado: Usuario = this.usuarioForm.value;
    const encargadoActualizado: EncargadoSalon = this.encargadoForm.value;
    let mensaje = `<b>Nombres</b>: ${encargadoActualizado.nombres}<br>`;
     mensaje += `<b>Apellidos</b>: ${encargadoActualizado.apPaterno} ${encargadoActualizado.apMaterno}<br>`;
     mensaje += `<b>Dni</b>: ${encargadoActualizado.dni}<br>`;
     mensaje += `<b>Telefono</b>: ${encargadoActualizado.telefono}<br>`;
     mensaje += `<b>Fecha de Contratación</b>: ${this.transformarFechaLarga(this.encargadoForm.value.fechaContratacion)}<br>`;
     mensaje += `<b>Email</b>: ${usuarioActualizado.email}<br>`;
    Swal.fire({
      title: 'Confirmar Actualización',
      html: '¿Desea actualizar el encargado con los siguientes datos?<br>' + mensaje,
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      icon: 'question'
    }).then((result) => {
      if(result.isConfirmed){
        encargadoActualizado.usuario = usuarioActualizado;
        encargadoActualizado.fechaContratacion = this.transformarFechaDate(this.encargadoForm.value.fechaContratacion);
        this.guardarCambios(encargadoActualizado);
      }
    })
  }

  guardarCambios(encargado: EncargadoSalon) {
    this.encargadoService.actualizarEncargadoSalon(this.encargadoId, encargado).subscribe(
      (response) => {
        console.log('Encargado actualizado correctamente:', response);
        Swal.fire('Encargado Actualizado!', 'El encargado se ha sido actualizado correctamente', 'success')
        .then((result) => {
          this.regresarListadoEncargados();
        });

      },
      (error) => {
        console.error('Error al actualizar el encargado:', error);
        if(error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    );
  }

  confirmarRegresoListadoEncargados(){
    Swal.fire({
      title: 'Confirmar Regreso',
      html: '¿Desea regresar al listado de encargados? <br>Los datos no guardados se perderán',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      icon: 'question'
    }).then((result) => {
      if(result.isConfirmed){
        this.regresarListadoEncargados();
      }
    })
  }

  transformarFechaDate(fecha: string){
    return new Date(`${fecha}:01:00:00`)
  }

  transformarFechaLarga(fecha: string){
    const horaConFecha = `${fecha}:00:00:00`;
    const fechaFormateada = new Date(horaConFecha);
    return fechaFormateada.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  cerrarSesion(){
    this.storageService.cerrarSesion();
    this.storageService.volverMenuPrincipal();
  }
}
