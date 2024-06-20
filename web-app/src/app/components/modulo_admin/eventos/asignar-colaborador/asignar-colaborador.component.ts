import { Component, OnInit } from '@angular/core';
import { Colaborador } from '../../../../models/colaborador.model';
import { Evento } from '../../../../models/evento.model';
import { EventoService } from '../../../../services/evento.service';
import { ColaboradorService } from '../../../../services/colaborador.service';
import Swal from 'sweetalert2';
import { StorageService } from '../../../../services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-asignar-colaborador',
  templateUrl: './asignar-colaborador.component.html',
  styleUrls: ['./asignar-colaborador.component.css']
})
export class AsignarColaboradorComponent implements OnInit{

  eventoForm!: FormGroup;
  evento!: Evento;
  colaboradores!: Colaborador[];
  colaboradoresSeleccionados: Colaborador[] = [];
  idsColaboradoresSeleccionados: number[] = [];
  colaboradorSeleccionado: number = 0;
  accion = 'asignar';
  eventoId = 0;

  constructor(private eventoService: EventoService,
    private colaboradorService: ColaboradorService,
    private storageService: StorageService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  )
  {
    this.eventoId = this.route.snapshot.params['evenid'];
  }

  ngOnInit(): void {
    this.inicializarFormulario();

    this.obtenerEvento()
    this.obtenerColaboradores();
  }

  inicializarFormulario(){
    this.eventoForm = this.fb.group({
      local: ['', Validators.required],
      cantidadPersonas: ['', Validators.required],
      encargado: ['', Validators.required],
      tipoEvento: ['', Validators.required],
      fechaEvento: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
    });
  }

  obtenerColaboradores(){
    this.colaboradorService.obtenerColaboradores().subscribe(
      (response: Colaborador[]) =>{
        this.colaboradores = response.filter(colaborador => colaborador.status === 'activo');
        console.log(response)
      },
      (error) =>{
        console.error('Error al obtener los colaboradores', error);
        if(error.status === 401){
          Swal.fire('Sesión Caducada!', 'Su sesión ha caducado, inicie sesión de nuevo.', 'info')
          .then(data => this.cerrarSesion())
        }
      }
    );
  }

  obtenerEvento(){
    return this.eventoService.obtenerEventoPorId(this.eventoId).subscribe(
      (response: Evento) =>{
        console.log('Evento obtenido con éxito', response);
        this.eventoForm.patchValue({
          local: response.local?.nombre,
          cantidadPersonas: response.cantidadPersonas,
          encargado: `${response.encargado?.nombres} ${response.encargado?.apPaterno}`,
          tipoEvento: response.tipoEvento?.nombre,
          fechaEvento: new Date(response.fechaEvento!).toISOString().split('T')[0],
          horaInicio: new Date(response.horaInicio!).toISOString().split('T')[1].split('Z')[0],
          horaFin: new Date(response.horaFin!).toISOString().split('T')[1].split('Z')[0],
        })
        this.evento = response
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

  quitarColaborador(id: number){
    this.colaboradoresSeleccionados = this.colaboradoresSeleccionados.filter(colaborador => colaborador.id != id);
    this.idsColaboradoresSeleccionados = this.idsColaboradoresSeleccionados.filter(idColaborador => idColaborador != id);
  }

  agregarColaboradores(){
    const colaboradorSeleccionado = this.colaboradores.find(colaborador => colaborador.id == this.colaboradorSeleccionado);
    const colaboradorYaSeleccionado = this.colaboradoresSeleccionados.find(colaborador => colaborador.id == colaboradorSeleccionado?.id);

    if (!colaboradorYaSeleccionado){
      this.colaboradoresSeleccionados.push(colaboradorSeleccionado!);
      this.idsColaboradoresSeleccionados.push(colaboradorSeleccionado?.id!)
    }
  }

  validarAsignacion(){
    if (this.colaboradoresSeleccionados.length === 0){
      Swal.fire('Colaboradores no seleccionados', 'Recuerde seleccionar colaboradores para poder asginarlos al evento', 'warning')
    }
    else{
      this.confirmarAsignacion();
    }
  }

  confirmarAsignacion(){
    let mensaje = '';
    this.colaboradoresSeleccionados.forEach(colaborador => {
      mensaje += `-${colaborador.nombres} ${colaborador.apPaterno} - ${colaborador.cargo?.nombre}<br>`
    })
    Swal.fire({
      title: 'Asignar Colaboradores al Evento!',
      html: '¿Desea Asignar los siguientes colaboradores?<br>' + mensaje,
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí'
    })
    .then((response) => {
      if(response.isConfirmed){
        this.asignarColaboradores()
      }
    });
  }

  asignarColaboradores(){
    this.colaboradoresSeleccionados.forEach((colaborador) => {
      this.eventoService.agregarColaboradoresAlEvento(this.evento.id!, this.idsColaboradoresSeleccionados!).subscribe(
        (reponse) => {
          console.log(reponse);
          this.otroColaborador();
          this.colaboradoresSeleccionados = [];
          this.idsColaboradoresSeleccionados = [];
          this.obtenerEvento();
        },
        (error)=>{
          console.error('Error al asignar Colaboradores', error)
          if(error.status === 401){
            Swal.fire('Sesión Caducada!', 'Su sesión ha caducado, inicie sesión de nuevo.', 'info')
            .then(data => this.cerrarSesion());
          }
          if(error.status === 406){
            Swal.fire('Colaborador ya asignado', error.error.message.message, 'warning')
          }
        }
      );
    })
  }

  verificarSeleccionColaborador() {
    if (this.colaboradorSeleccionado === 0) {
      Swal.fire('Colaborador No Seleccionado', 'Recuerde seleccionar el colaborador antes de agregarlo', 'warning')
    } else {
      this.agregarColaboradores()
    }
  }

  otroColaborador() {
    this.colaboradorSeleccionado = 0;
  }

  cerrarSesion() {
    this.storageService.cerrarSesion();
    this.storageService.volverMenuPrincipal();
  }

  confirmarRetiro(idColaborador: number){
    const colaboradorARetirar = this.evento.colaboradores?.find(colaborador => colaborador.id == idColaborador);
    let mensaje = `¿Desea retirar <b>${colaboradorARetirar?.nombres}</b> del evento?`;
    Swal.fire({
      title: 'Retirar Colaborador del Evento!',
      html: mensaje,
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí'
    })
    .then((response) => {
      if(response.isConfirmed){
        this.retirarColaborador(idColaborador)
      }
    });
  }

  retirarColaborador(idColaborador:number){
    this.eventoService.retirarColaboradorDelEvento(this.evento.id!, idColaborador).subscribe(
      (response) => {
        console.log(response);
        this.otroColaborador();

        this.obtenerEvento();
      },
      (error) =>{
        console.error('Error al retirar Colaborador', error);
        if(error.status === 401){
          Swal.fire('Sesión Caducada!', 'Su sesión ha caducado, inicie sesión de nuevo.', 'info')
          .then(data => this.cerrarSesion())
        }
      }
    )
  }

  irListadoEventos(){
    let mensaje = '¿Desea ir a la pantalla de <b>Listar Eventos</b>? <br>La información guardada se perderá.'
    Swal.fire({
      title: 'Ir al Listado de Eventos!',
      html: mensaje,
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí'
    })
    .then((response) => {
      if(response.isConfirmed){
        this.router.navigate(['/dashboard', 'eventos'])
      }
    });
  }

  validarGuardado(){
    if (this.evento.colaboradores?.length){
      let mensaje = '¿Desea guardar el evento con los siguientes colaboradores?<br>';
      this.evento.colaboradores?.forEach(colaborador => {
        mensaje += `-${colaborador.nombres} ${colaborador.apPaterno} - ${colaborador.cargo?.nombre}<br>`
      })
      Swal.fire({
        title: 'Guardar Evento!',
        html: mensaje,
        icon: 'question',
        showCancelButton: true,
        cancelButtonText: 'No',
        confirmButtonText: 'Sí'
      })
      .then((response) => {
        if(response.isConfirmed){
          this.guardarEvento();
        }
      });
    }
    else{
      Swal.fire({
        title: 'No es posible guardar el evento!',
        html: 'El evento debe de tener registrados los colaboradores necesarios',
        icon: 'question',
        confirmButtonText: 'OK'
      })
    }
  }

  guardarEvento(){
    this.eventoService.colocarAsginadoAEvento(this.evento.id!).subscribe(
      (response) => {
        this.irListadoEventos();
      },
      (error) => {
        console.error('Error al asignar Colaboradores', error);
        if(error.status === 401){
          Swal.fire('Sesión Caducada!', 'Su sesión ha caducado, inicie sesión de nuevo.', 'info')
          .then(data => this.cerrarSesion())
        }
      }
    )
  }
}

