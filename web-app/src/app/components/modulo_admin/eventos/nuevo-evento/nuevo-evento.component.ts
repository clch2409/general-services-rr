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
import { EncargadoSalonService } from '../../../../services/encargadoSalon.service';
import { EncargadoSalon } from '../../../../models/encargadoSalon.model';
import { Cliente } from '../../../../models/cliente.model';
import { ClienteService } from '../../../../services/cliente.service';
import { Usuario } from '../../../../models/usuario.model';
import { TipoEvento } from '../../../../models/tipoEvento.model';
import { TipoEventoService } from '../../../../services/tipoEvento.service';


@Component({
  selector: 'app-nuevo-evento',
  templateUrl: './nuevo-evento.component.html',
  styleUrls: ['./nuevo-evento.component.css']
})

export class NuevoEventoComponent implements OnInit {
  eventoForm!: FormGroup;
  locales!: Local[];
  tipoBuffets!: TipoBuffet[];
  encargados!: EncargadoSalon[];
  clientes!: Cliente[];
  tiposEvento!: TipoEvento[];
  usuario!: Usuario;
  localSeleccionado: Local = new Local();
  nombreCliente!: String;
  clienteSeleccionado!: Cliente;
  rol!: String;
  isValid!: boolean;
  passwordPattern: RegExp = Patterns.PASSWORD_PATTERN.getPattern();
  namePattern: RegExp = Patterns.NAME_PATTERN.getPattern();

  constructor(private fb: FormBuilder,
    private eventoService: EventoService,
    private localService: LocalService,
    private tipoBuffetService: TipoBuffetService,
    private storageService: StorageService,
    private encargadoService: EncargadoSalonService,
    private clienteService: ClienteService,
    private tipoEventoService: TipoEventoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerLocales();
    this.obtenerTipoBuffets();
    this.inicializarFormulario();
    this.obtenerEncargados();
    this.obtenerRol();
    this.obtenerUsuario();
    this.obtenerTipoEvento();
    if (this.rol === 'admin' || this.rol === 'encargado'){
      this.obtenerClientes();
    }
  }

  inicializarFormulario() {
    if (this.rol === 'admin' || this.rol === 'encargado'){
      this.eventoForm = this.fb.group({
        localId: ['', Validators.required],
        cantidadPersonas: ['', Validators.required],
        nombreCliente: ['', Validators.required],
        tipoBuffetId: ['', Validators.required],
        encargadoId: ['', Validators.required],
        tipoEventoId: ['', Validators.required],
        fechaEvento: ['', Validators.required],
        horaInicio: ['', Validators.required],
        horaFin: ['', Validators.required],
      });
    }
    else{
      this.eventoForm = this.fb.group({
        localId: ['', Validators.required],
        cantidadPersonas: ['', Validators.required],
        tipoBuffetId: ['', Validators.required],
        tipoEventoId: ['', Validators.required],
        encargadoId: ['', Validators.required],
        fechaEvento: ['', Validators.required],
        horaInicio: ['', Validators.required],
        horaFin: ['', Validators.required],
      });
    }
  }

  irNuevoBuffet(){
    this.router.navigate(['/dashboard', 'nuevo-tipo-buffet'])
  }

  irNuevoTipoEvento(){
    this.router.navigate(['/dashboard', 'nuevo-tipo-evento'])
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

  confirmarAgregarEvento(){
    Swal.fire({
      title: 'Agregar Tipo de Evento!',
      html: '¿Desea Agregar un nuevo Tipo de Evento?<br>Los datos ingresados se perderán',
      icon: 'info',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí'
    })
    .then((response) => {
      if(response.isConfirmed){
        this.irNuevoTipoEvento()
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
        console.error('Error al obtener locales', error);
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
        console.error('Error al obtener tipo de buffet', error);
        if (error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    )
  }

  obtenerEncargados(){
    this.encargadoService.obtenerEncargadosSalon().subscribe(
      (response: EncargadoSalon[]) => {
        this.encargados = response;
        console.log(this.encargados)
      },
      (error) => {
        console.error('Error al obtener encargados', error);
        if (error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    )
  }

  obtenerClientes(){
    this.clienteService.obtenerClientes().subscribe(
      (response: Cliente[]) => {
        this.clientes = response;
        console.log(this.clientes)
      },
      (error) => {
        console.error('Error al obtener clientes', error);
        if (error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    );
  }

  obtenerTipoEvento(){
    this.tipoEventoService.obtenerTipoEventos().subscribe(
      (response: TipoEvento[]) => {
        this.tiposEvento = response;
        console.log(response);

      },
      (error) => {
        console.error('Error al obtener tipo de evento', error);
        if (error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    );
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
    const horaInicio = this.transformarHora(eventoForm.horaInicio, eventoForm.fechaEvento);
    const horaFin = this.transformarHora(eventoForm.horaFin, eventoForm.fechaEvento);

    const tipoBuffetSeleccionado = this.tipoBuffets.find(tipoBuffet => tipoBuffet.id == eventoForm.tipoBuffetId);
    const encargadoSeleccionado = this.encargados.find(encargado => encargado.id == eventoForm.encargadoId);
    const tipoEventoSeleccionado = this.tiposEvento.find(tipoEvento => tipoEvento.id == eventoForm.tipoEventoId);

    let mensaje = `-Local: ${this.localSeleccionado?.nombre}<br>`;
    mensaje += `-Fecha del evento: ${this.transformarFechaLarga(eventoForm.fechaEvento)}<br>`;
    mensaje += `-Hora de inicio: ${horaInicio}<br>`;
    mensaje += `-Hora de fin: ${horaFin}<br>`;
    mensaje += `-Cantidad de Personas: ${eventoForm.cantidadPersonas}<br>`;
    mensaje += `-Tipo de Evento: ${tipoEventoSeleccionado?.nombre}<br>`;
    mensaje += `-Tipo de Buffet: ${tipoBuffetSeleccionado?.nombre}<br>`;
    mensaje += `-Encargado: ${encargadoSeleccionado?.nombres} ${encargadoSeleccionado?.apPaterno}<br>`;

    if(this.rol === 'admin' || this.rol === 'encargado'){
      this.clienteSeleccionado = this.clientes.find(cliente => `${cliente.nombres} ${cliente.apPaterno}` == this.nombreCliente)!;
      mensaje += `-Cliente: ${this.clienteSeleccionado?.nombres} ${this.clienteSeleccionado?.apPaterno}<br>`;
    }

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
        nuevoEvento.localId = eventoForm.localId;
        nuevoEvento.fechaEvento = this.transformarFechaDate(eventoForm.fechaEvento);
        nuevoEvento.cantidadPersonas = eventoForm.cantidadPersonas;
        nuevoEvento.tipoBuffetId = eventoForm.tipoBuffetId;
        nuevoEvento.encargadoId = eventoForm.encargadoId;
        nuevoEvento.horaInicio = this.tranformarHoraDate(horaInicio, eventoForm.fechaEvento);
        nuevoEvento.horaFin = this.tranformarHoraDate(horaFin, eventoForm.fechaEvento);
        nuevoEvento.tipoEventoId = eventoForm.tipoEventoId;
        if (this.rol === 'admin' || this.rol === 'encargado'){
          console.log('agregando cliente')
          nuevoEvento.clienteId = this.clienteSeleccionado.id;
        }
        else{
          this.clienteService.obtenerClientePorEmail(this.usuario.email!).subscribe(
            (response: Cliente) => {
              nuevoEvento.clienteId = response.id!;
            }
          );
        }
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
        if (error.status === 406){
          Swal.fire('Error al Crear Evento!', error.error.message.message, 'error');
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

  seleccionarLocal(){
    const localId = this.eventoForm.value.localId;
    this.localSeleccionado = this.locales.find(local => local.id == localId)!;
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

  obtenerRol(){
    this.rol = this.storageService.obtenerRol();
  }

  obtenerUsuario(){
    this.usuario = this.storageService.obtenerUsuario();
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

  transformarHora(hora: string, fechaEvento: string){
    const horaConFecha = new Date(`${fechaEvento}:${hora}:00`);
    return horaConFecha.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  tranformarHoraDate(hora: string, fechaEvento: string){
    const horaConFecha = `${fechaEvento}:${hora}:00`;
    const fechaConHoraDate = new Date(horaConFecha);
    return fechaConHoraDate;
  }

  sumarHoras(cantidadHoras: number, horaInicio: string, fechaEvento: string){
    const horaInicioConFecha = `${fechaEvento}:${horaInicio}:00`;
    const horaInicioDate = new Date(horaInicioConFecha);
    const miliSecondHoras = cantidadHoras * 60 * 60 * 1000;
    return horaInicioDate.setMilliseconds(horaInicioDate.getMilliseconds() + miliSecondHoras);
  }

  colocarHoraFin(){
    const fechaEvento = this.eventoForm.value.fechaEvento;
    const horaInicio = this.eventoForm.value.horaInicio;
    const horaFin = new Date(this.sumarHoras(8, horaInicio, fechaEvento));
    this.eventoForm.patchValue({
      horaFin: this.transformarHora(horaFin.toTimeString().split(' ')[0], fechaEvento)
    })
  }

  validarCantidadPersonas(){
    this.isValid = (this.eventoForm.value.cantidadPersonas >= this.localSeleccionado.aforoMinimo!) && (this.eventoForm.value.cantidadPersonas <= this.localSeleccionado.aforoMaximo!);
  }
}
