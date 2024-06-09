import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { StorageService } from '../../../../services/storage.service';
import { Patterns } from '../../../../utils/patterns';
import { Evento } from '../../../../models/evento.model';
import { EventoService } from '../../../../services/evento.service';

@Component({
  selector: 'app-editar-evento',
  templateUrl: './editar-evento.component.html',
  styleUrls: ['./editar-evento.component.css']
})
export class EditarEventoComponent implements OnInit {
  eventoForm: FormGroup;
  eventoId: number;
  evento: Evento = new Evento();
  passwordPattern: RegExp = Patterns.PASSWORD_PATTERN.getPattern();
  namePattern: RegExp = Patterns.NAME_PATTERN.getPattern();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private eventoService: EventoService,
    private storageService: StorageService
  ) {
    this.eventoId = 0;
    this.eventoForm = this.fb.group({});
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.eventoId = this.route.snapshot.params['evtid'];
    this.obtenerEvento();
  }

  ngAfterViewInit(): void {
    this.storageService.comprobarSesion();
  }

  ngOnChanges(): void {
    this.storageService.comprobarSesion();
  }

  obtenerEvento() {
    this.eventoService.obtenerEventoPorId(this.eventoId).subscribe({
      next: (data: Evento) => {
        this.evento = data;
        console.log(data);
        this.eventoForm.patchValue({
         ...data,
          tipoBuffet: data.tipoBuffet?.id,
          encargado: data.encargado?.id,
          cliente: data.cliente?.id,
          local: data.local?.id,
          tipoEvento: data.tipoEvento?.id
        });
      },
      error: err => {
        console.error('Error al obtener evento:', err);
        if (err.status === 401) {
          Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    });
  }

  inicializarFormulario() {
    this.eventoForm = this.fb.group({
      servicios: ['', Validators.required],
      localId: ['', Validators.required],
      diaId: ['', Validators.required],
      cantidadPersonas: ['', Validators.required],
      tipoBuffetId: ['', Validators.required]
    });
  }

  validarFormulario() {
    if (this.eventoForm.valid) {
      this.solicitarConfirmacion();
    } else {
      Swal.fire('Datos Faltantes', 'Verifique que se estén ingresando todos los datos del Evento', 'error');
    }
  }

  solicitarConfirmacion(): void {
    delete this.eventoForm.value.tipoBuffet;
    delete this.eventoForm.value.local;
    const eventoActualizado: Evento = this.eventoForm.value;
    let mensaje = `<b>Servicios</b>: ${eventoActualizado.servicios}<br>`;
    mensaje += `<b>LocalId</b>: ${eventoActualizado.localId}<br>`;
    mensaje += `<b>DiaId</b>: ${eventoActualizado.fechaEvento}<br>`;
    mensaje += `<b>Cantidad Personas</b>: ${eventoActualizado.cantidadPersonas}<br>`;
    mensaje += `<b>Tipo BuffetId</b>: ${eventoActualizado.tipoBuffetId}<br>`;
    Swal.fire({
      title: 'Confirmar Actualización',
      html: '¿Desea actualizar el evento con los siguientes datos?<br>' + mensaje,
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      icon: 'question'
    }).then((result) => {
      if (result.isConfirmed) {
        this.guardarCambios(eventoActualizado);
      }
    });
  }

  guardarCambios(eventoActualizado: Evento) {
    this.eventoService.actualizarEvento(this.eventoId, eventoActualizado).subscribe(
      (response) => {
        console.log('Evento actualizado correctamente:', response);
        Swal.fire('Evento Actualizado!', 'El evento ha sido actualizado correctamente', 'success')
         .then(data => this.regresarListaEventos());
      },
      (error) => {
        console.error('Error al actualizar el evento:', error);
        if (error.status === 401) {
          Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    );
  }

  cerrarSesion() {
    this.storageService.cerrarSesion();
    this.storageService.volverMenuPrincipal();
  }

  regresarListaEventos() {
    this.router.navigate(['/dashboard', 'eventos']);
  }
}
