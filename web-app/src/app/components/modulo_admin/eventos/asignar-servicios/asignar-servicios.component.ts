import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { EventoService } from '../../../../services/evento.service';
import { LocalService } from '../../../../services/local.service';
import { TipoBuffetService } from '../../../../services/tipoBuffet.service';
import { ServicioService } from '../../../../services/servicio.service';
import { StorageService } from '../../../../services/storage.service';
import { Router } from '@angular/router';
import { Servicio } from '../../../../models/servicio.model';
import { Evento } from '../../../../models/evento.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignar-servicios',
  templateUrl: './asignar-servicios.component.html',
  styleUrl: './asignar-servicios.component.css'
})
export class AsignarServiciosComponent {
  servicios!: Servicio[];
  evento!: Evento;
  serviciosSeleccionados!: Servicio[];
  serviciosSeleccionadosId!: number[];


  constructor(private fb: FormBuilder,
    private eventoService: EventoService,
    private serviciosService: ServicioService,
    private storageService: StorageService,
    private router: Router
  ) {}

  obtenerServicios(){
    this.serviciosService.obtenerServicios().subscribe(
      (response: Servicio[]) => {
        this.servicios = response;
        console.log(this.servicios)
      },
      (error) => {
        console.error('Error al obtener servicios:', error);
        if (error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    )
  }

  seleccionarServicio(servicioId: number){
    const servicioSeleccionado = this.servicios.find(servicio => servicio.id === servicioId);
    this.serviciosSeleccionados.push(servicioSeleccionado!);
    this.serviciosSeleccionadosId.push(servicioId);
  }

  validarConfirmacion(){
    let mensaje = '';
    this.serviciosSeleccionados.forEach(servicio => {
      mensaje += `-${this.convertirPrimeraLetraEnMayuscula(servicio.nombre!)}<br>`
    })
    Swal.fire({
      title: 'Asignar Servicios al Evento!',
      html: '¿Desea Asignar los siguientes Servicios al Evento?<br>' + mensaje,
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí'
    })
    .then((response) => {
      if(response.isConfirmed){
        this.asignarServicios();
      }
    });
  }

  asignarServicios(){
    this.eventoService.agregarServiciosAlEvento(this.evento.id!, this.serviciosSeleccionadosId).subscribe(
      (reponse) => {
        console.log(reponse);
        Swal.fire('Servicios Asignados!', 'Los Servicios han sido asignados al Evento correctamente!', 'success')
        .then(result => this.regresarListadoEventos());
      },
      (error) => {
        console.error('Error al asignar Servicios', error);
        if(error.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    )
  }

  convertirPrimeraLetraEnMayuscula(string: String) {
    if (typeof string !== 'string' || string.length === 0) {
      return '';
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  regresarListadoEventos(){
    this.router.navigate(['/dashboard', 'eventos'])
  }

  cerrarSesion(){
    this.storageService.cerrarSesion();
    this.storageService.volverMenuPrincipal();
  }
}
