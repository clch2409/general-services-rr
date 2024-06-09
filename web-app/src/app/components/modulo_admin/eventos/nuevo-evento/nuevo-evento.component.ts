import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventoService } from '../../../../services/evento.service';
import { Evento } from '../../../../models/evento.model';
import { Patterns } from '../../../../utils/patterns';
import { StorageService } from '../../../../services/storage.service';
import { TipoBuffet } from '../../../../models/tipoBuffet.model';
import { Local } from '../../../../models/local.model';
import { LocalService } from '../../../../services/local.service';
import { TipoBuffetService } from '../../../../services/tipoBuffet.service';
import Swal from 'sweetalert2';
import { ServicioService } from '../../../../services/servicio.service';
import { Servicio } from '../../../../models/servicio.model';


@Component({
  selector: 'app-nuevo-evento',
  templateUrl: './nuevo-evento.component.html',
  styleUrls: ['./nuevo-evento.component.css']
})

export class NuevoEventoComponent implements OnInit {
  eventoForm!: FormGroup;
  locales!: Local[];
  tipoBuffets!: TipoBuffet[];
  passwordPattern: RegExp = Patterns.PASSWORD_PATTERN.getPattern();
  namePattern: RegExp = Patterns.NAME_PATTERN.getPattern();

  constructor(private fb: FormBuilder,
    private eventoService: EventoService,
    private localService: LocalService,
    private tipoBuffetService: TipoBuffetService,
    private storageService: StorageService,
    private serviciosService: ServicioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerLocales();
    this.obtenerTipoBuffets();
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.eventoForm = this.fb.group({
      servicios: ['', [Validators.required]],
      localId: ['', Validators.required],
      diaId: ['', Validators.required],
      cantidadPersonas: ['', Validators.required],
      tipoBuffetId: ['', Validators.required],
    });
  }

  irNuevoBuffet(){
    this.router.navigate(['/dashboard', 'nuevo-tipo-buffet'])
  }

  confirmarAgregarBuffet(){
    Swal.fire({
      title: 'Agregar Tipo de Buffet!',
      html: '¿Desea Agregar un nuevo Buffet?<br>Los datos ingresados se perderán',
      icon: 'info',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí'
    })
    .then((response) => {
      if(response.isConfirmed){
        this.irNuevoBuffet()
      }
    });
  }

  obtenerLocales(){
    this.localService.obtenerLocales().subscribe(
      (response: Local[]) => {
        this.locales = response;
        console.log(this.locales)
      },
      (error) => {
        console.error('Error al obtener locales:', error);
        if (error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    )
  }

  obtenerTipoBuffets(){
    this.tipoBuffetService.obtenerTipoBuffet().subscribe(
      (response: TipoBuffet[]) => {
        this.tipoBuffets = response;
        console.log(this.tipoBuffets)
      },
      (error) => {
        console.error('Error al obtener tipo de buffet:', error);
        if (error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    )
  }

  validarConfirmacion(){
    if (!this.eventoForm.valid){
      Swal.fire('Datos Faltantes!', 'Ingrese todos datos del evento', 'error');
    }
    else{
      this.confirmarGuardadoEvento();
    }
  }

  confirmarGuardadoEvento(){
    const eventoForm = this.eventoForm.value;
    console.log(eventoForm)
    const localSeleccionado = this.locales.find(local => local.id == eventoForm.localId);
    const tipoBuffetSeleccionado = this.tipoBuffets.find(tipoBuffet => tipoBuffet.id == eventoForm.tipoBuffetId);
    let mensaje = `-Servicios: ${eventoForm.servicios}<br>`;
    mensaje += `-Local: ${localSeleccionado?.nombre}<br>`;
    mensaje += `-Día: ${eventoForm.diaId}<br>`;
    mensaje += `-Cantidad de Personas: ${eventoForm.cantidadPersonas}<br>`;
    mensaje += `-Tipo de Buffet: ${tipoBuffetSeleccionado?.nombre}<br>`;
    Swal.fire({
      title: 'Crear Evento!',
      html: 'Desea registrar los siguientes datos del evento?<br>' + mensaje,
      icon: 'question',
      confirmButtonText: 'Sí',
      showCancelButton: true,
      cancelButtonText: 'No'
    }).then(result => {
      if (result.isConfirmed){
        const nuevoEvento = new Evento();
        nuevoEvento.servicios = eventoForm.servicios;
        nuevoEvento.localId = eventoForm.localId;
        nuevoEvento.fechaEvento = eventoForm.diaId;
        nuevoEvento.cantidadPersonas = eventoForm.cantidadPersonas;
        nuevoEvento.tipoBuffetId = eventoForm.tipoBuffetId;
        this.guardarEvento(nuevoEvento)
      }
    });
  }

  guardarEvento(nuevoEvento: Evento) {
    this.eventoService.crearEvento(nuevoEvento).subscribe(
      (response: Evento) => {
        console.log('Evento creado correctamente:', response);
        Swal.fire('Evento Creado!', 'El evento ha sido registrado correctamente!', 'success')
       .then(result => this.informarVentanaAgregarServicios(response.id!));
      },
      (error) => {
        console.error('Error al guardar evento:', error);
        if (error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    );
  }

  informarVentanaAgregarServicios(eventoId: number){
    Swal.fire({
      title: 'Agregar Servicios!',
      html: 'Pasará a la pantalla de Agregar Servicios para asignarlos al evento.',
      icon: 'info',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí'
    }).then(result => {
      if(result.isConfirmed){
        this.irAgregarServicios(eventoId)
      }
    })
  }

  irAgregarServicios(eventoId: number){
    this.router.navigate(['/dashboard', 'asignar-servicios', eventoId]);
  }

  cerrarSesion(){
    this.storageService.cerrarSesion();
    this.storageService.volverMenuPrincipal();
  }


  regresarListadoEventos(){
    this.router.navigate(['/dashboard', 'eventos'])
  }

  convertirPrimeraLetraEnMayuscula(string: String) {
    if (typeof string !== 'string' || string.length === 0) {
      return '';
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

}
