import { Component, OnInit } from '@angular/core';
import { Colaborador } from '../../../../models/colaborador.model';
import { Evento } from '../../../../models/evento.model';
import { EventoService } from '../../../../services/evento.service';
import { ColaboradorService } from '../../../../services/colaborador.service';
import Swal from 'sweetalert2';
import { StorageService } from '../../../../services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asignar-colaborador',
  templateUrl: './asignar-colaborador.component.html',
  styleUrls: ['./asignar-colaborador.component.css']
})
export class AsignarColaboradorComponent implements OnInit{
  
  eventos!: Evento[];
  colaboradores!: Colaborador[];
  eventoSeleccionadoId!: number;
  eventoSeleccionado!: Evento;
  colaboradoresSeleccionados: any[] = [];
  colaboradorSeleccionado: String = '';
  accion = 'asignar';

  constructor(private eventoService: EventoService,
    private colaboradorService: ColaboradorService,
    private storageService: StorageService,
    private router: Router
  )
  {
  }
  
  ngOnInit(): void {
    this.obtenerEventos()
    this.obtenerColaboradores();
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

  obtenerEventos(){
    return this.eventoService.obtenerEventos().subscribe(
      (response: Evento[]) =>{
        this.eventos = response.filter(colaborador => colaborador.status === 'activo');
        this.eventoSeleccionado = this.eventos[0];
        this.eventoSeleccionadoId = this.eventoSeleccionado.id!
        console.log(this.eventos)
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
  
  obtenerEventoSeleccionado(){
    this.eventoSeleccionado = this.eventos.filter(evento => evento.id == this.eventoSeleccionadoId)[0];
  }

  quitarColaborador(id: any){
    const colaboradorSeleccionadoSelector = document.getElementById('selected-'+ id) as HTMLSpanElement;
    console.log({
      id: id,
      valor: colaboradorSeleccionadoSelector.textContent,
    })
    const colaboradorSeleccionado = this.colaboradores.find(colaborador => colaborador.nombres === colaboradorSeleccionadoSelector.textContent);

    this.colaboradoresSeleccionados = this.colaboradoresSeleccionados.filter(colaborador => colaborador.colaborador.nombres !== colaboradorSeleccionado?.nombres)
  }

  agregarColaboradores(){
    const colaboradorSeleccionado = this.colaboradores.find(colaborador => colaborador.nombres === this.colaboradorSeleccionado);
    const findColaboradorSeleccionado = this.colaboradoresSeleccionados.find(colaborador => colaborador.colaborador.nombres === colaboradorSeleccionado?.nombres);

    if(findColaboradorSeleccionado){
      this.colaboradoresSeleccionados = this.colaboradoresSeleccionados.map(colaborador => {
        if (colaborador.colaborador.id === findColaboradorSeleccionado.colaborador.id){
          return {
            ...colaborador
          }
        }
      });
    }else{
      this.colaboradoresSeleccionados.push({
        colaborador: colaboradorSeleccionado,
      })
    }
  }

  validarAsignacion(){
    if (this.colaboradoresSeleccionados.length === 0){
      Swal.fire('Colaboradores No Seleccionados', 'Recuerde seleccionar Colaboradores para poder asginarlos al evento escogido', 'warning')
    }
    else{
      this.confirmarAsignacion();
    }
  }

  confirmarAsignacion(){
    let mensaje = '';
    this.colaboradoresSeleccionados.forEach(colaborador => {
      mensaje += `-${colaborador.colaborador.nombres}<br>`
    })
    Swal.fire({
      title: 'Asignar Colaboradores al Evento!',
      html: '¿Desea Asignar los siguientes colaboradores?<br>' + mensaje,
      icon: 'info',
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
      this.eventoService.agregarColaboradoresAlEvento(this.eventoSeleccionado.id!, colaborador.colaborador.id).subscribe(
        (reponse) => {
          console.log(reponse);
        },
        (error)=>{
          console.error('Error al asignar Colaboradores', error)
        }
      );
    })
    window.location.reload()
  }

  verificarSeleccionColaborador() {
    if (this.colaboradorSeleccionado === '') {
      Swal.fire('Colaborador No Seleccionado', 'Recuerde seleccionar el colaborador antes de agregarlo', 'warning')
    } else {
      this.agregarColaboradores()
    }
  }

  otroColaborador() {
    this.colaboradorSeleccionado = '';
  }

  cerrarSesion() {
    this.storageService.cerrarSesion();
    this.storageService.volverMenuPrincipal();
  }

  confirmarRetiro(id: number){
    const nombreColaboradorARetirar = document.getElementById('colaboradorEventoSelected-'+id) as HTMLSpanElement;
    const colaboradorARetirar = this.eventoSeleccionado.colaboradores?.find(colaborador => colaborador.nombres == nombreColaboradorARetirar.textContent);
    let mensaje = `¿Desea retirar <b>${colaboradorARetirar?.nombres}</b> de <b>${this.eventoSeleccionado.id}</b>?`;
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
      }
    });
  }

  retirarEvento(idColaborador:number){
    console.log({
      idColaborador
    })
    this.eventoService.retirarColaboradoresDelEvento(this.eventoSeleccionadoId, idColaborador).subscribe(
      (response) => {
        console.log('Retirado con éxito', response);
        Swal.fire({
          title: 'Colaborador Retiradoº',
          html: 'El colaborador ha sido retirado correctamente.',
          icon: 'success',
          confirmButtonText: 'OK',
        })
        .then((response) => {
          window.location.reload();
        })

      },
      (error) => {
        console.error('Error en retirar colaborador', error);
      }
    )
  }
  
  irListadoEventos(){
    let mensaje = '¿Desea ir a la pantalla de <b>Listar Eventos</b>? <br>Los colaboradores no se guardarán.'
    Swal.fire({
      title: 'Ir al Listado de Eventos!',
      html: mensaje,
      icon: 'info',
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
}

