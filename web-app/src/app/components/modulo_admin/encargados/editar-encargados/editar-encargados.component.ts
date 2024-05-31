import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EncargadoSalon } from '../../../../models/encargadoSalon.model';
import { EncargadoSalonService } from '../../../../services/encargadoSalon.service';
import { StorageService } from '../../../../services/storage.service';
import Swal from 'sweetalert2';
import { Usuario } from '../../../../models/usuario.model';

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
      nombres: ['', Validators.required],
      apPaterno: ['', Validators.required],
      apMaterno: ['', Validators.required],
      telefono: ['', Validators.required],
      dni: ['', Validators.required],
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
     mensaje += `<b>Fecha de Contratación</b>: ${encargadoActualizado.fechaContratacion}<br>`;
     mensaje += `<b>Email</b>: ${usuarioActualizado.email}<br>`;
    Swal.fire({
      title: 'Confirmar Actualización',
      html: '¿Desea actualizar el encargado con los siguientes datos?<br>' + mensaje,
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      icon: 'question'
    }).then((result) => {
      if(result.isConfirmed){
        encargadoActualizado.usuario = usuarioActualizado;
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

  cerrarSesion(){
    this.storageService.cerrarSesion();
    this.storageService.volverMenuPrincipal();
  }
}
