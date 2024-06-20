import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { StorageService } from '../../../../services/storage.service';
import { Patterns } from '../../../../utils/patterns';
import { Evento } from '../../../../models/evento.model';
import { EventoService } from '../../../../services/evento.service';
import { Local } from '../../../../models/local.model';
import { TipoBuffet } from '../../../../models/tipoBuffet.model';
import { EncargadoSalon } from '../../../../models/encargadoSalon.model';
import { Cliente } from '../../../../models/cliente.model';
import { TipoEvento } from '../../../../models/tipoEvento.model';
import { Usuario } from '../../../../models/usuario.model';
import { LocalService } from '../../../../services/local.service';
import { TipoBuffetService } from '../../../../services/tipoBuffet.service';
import { EncargadoSalonService } from '../../../../services/encargadoSalon.service';
import { ClienteService } from '../../../../services/cliente.service';
import { TipoEventoService } from '../../../../services/tipoEvento.service';

@Component({
  selector: 'app-editar-evento',
  templateUrl: './editar-evento.component.html',
  styleUrls: ['./editar-evento.component.css']
})
export class EditarEventoComponent implements OnInit {
  eventoForm!: FormGroup;
  evento!: Evento;
  eventoId: number;
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private eventoService: EventoService,
    private localService: LocalService,
    private tipoBuffetService: TipoBuffetService,
    private storageService: StorageService,
    private encargadoService: EncargadoSalonService,
    private clienteService: ClienteService,
    private tipoEventoService: TipoEventoService,
  ) {
    this.eventoId = 0;
    this.eventoForm = this.fb.group({});
    this.inicializarFormulario();

  }

  ngOnInit(): void {
    this.eventoId = this.route.snapshot.params['evenid'];
    this.obtenerEvento();
    this.obtenerLocales();
    this.obtenerTipoBuffets();
    this.obtenerTipoEvento();
    this.obtenerEncargados();
    this.obtenerRol();
    this.obtenerUsuario();
  }

  ngAfterViewInit(): void {
    this.storageService.comprobarSesion();
  }

  ngOnChanges(): void {
    this.storageService.comprobarSesion();
  }

  obtenerEvento(){
    return this.eventoService.obtenerEventoPorId(this.eventoId).subscribe(
      (response: Evento) =>{
        console.log('Evento obtenido con éxito', response);
        this.eventoForm.patchValue({
          localId: response.localId,
          cantidadPersonas: response.cantidadPersonas,
          tipoBuffetId: response.tipoBuffetId,
          encargadoId: response.encargadoId,
          tipoEventoId: response.tipoEventoId,
          fechaEvento: new Date(response.fechaEvento!).toISOString().split('T')[0],
          horaInicio: new Date(response.horaInicio!).toISOString().split('T')[1].split('Z')[0],
          horaFin: new Date(response.horaFin!).toISOString().split('T')[1].split('Z')[0],
        })
        this.nombreCliente = `${response.cliente?.nombres} ${response.cliente?.apPaterno}`
        this.evento = response;
      },
      (error) =>{
        console.error('Error al obtener los colaboradores', error);
        if(error.status === 401){
          Swal.fire('Sesión Caducada!', 'Su sesión ha caducado, inicie sesión de nuevo.', 'info')
          .then(data => this.cerrarSesion())
        }
      }
    )
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

  seleccionarLocal(){
    const localId = this.eventoForm.value.localId;
    this.localSeleccionado = this.locales.find(local => local.id == localId)!;
  }

  validarFormulario() {
    if (this.eventoForm.valid) {
      this.solicitarConfirmacion();
    } else {
      Swal.fire('Datos Faltantes', 'Verifique que se estén ingresando todos los datos del Evento', 'error');
    }
  }

  solicitarConfirmacion(): void {
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
      title: 'Confirmar Actualización',
      html: '¿Desea actualizar el evento con los siguientes datos?<br>' + mensaje,
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      icon: 'question'
    }).then((result) => {
      if (result.isConfirmed) {
        const eventoActualizado = new Evento();
        eventoActualizado.localId = eventoForm.localId;
        eventoActualizado.fechaEvento = this.transformarFechaDate(eventoForm.fechaEvento);
        eventoActualizado.cantidadPersonas = eventoForm.cantidadPersonas;
        eventoActualizado.tipoBuffetId = eventoForm.tipoBuffetId;
        eventoActualizado.encargadoId = eventoForm.encargadoId;
        eventoActualizado.horaInicio = this.tranformarHoraDate(horaInicio, eventoForm.fechaEvento);
        eventoActualizado.horaFin = this.tranformarHoraDate(horaFin, eventoForm.fechaEvento);
        eventoActualizado.tipoEventoId = eventoForm.tipoEventoId;
        if (this.rol === 'admin' || this.rol === 'encargado'){
          console.log('agregando cliente')
          eventoActualizado.clienteId = this.clienteSeleccionado.id;
        }
        else{
          this.clienteService.obtenerClientePorEmail(this.usuario.email!).subscribe(
            (response: Cliente) => {
              eventoActualizado.clienteId = response.id!;
            }
          );
        }
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

  cerrarSesion() {
    this.storageService.cerrarSesion();
    this.storageService.volverMenuPrincipal();
  }

  confirmarRegreso(){
    Swal.fire({
      title: '¿Desea regresar al Listado de Eventos?',
      text: 'Se perderan los cambios no guardados',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.regresarListaEventos();
      }
    })
  }

  regresarListaEventos() {
    this.router.navigate(['/dashboard', 'eventos']);
  }
}
