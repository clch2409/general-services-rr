import { Component, OnInit } from '@angular/core';
import { LocalService } from '../../../../services/local.service';
import { InsumoService } from '../../../../services/insumo.service';
import { StorageService } from '../../../../services/storage.service';
import { Router } from '@angular/router';
import { Insumo } from '../../../../models/insumo.model';
import { Local } from '../../../../models/local.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mover-insumos',
  templateUrl: './mover-insumos.component.html',
  styleUrl: './mover-insumos.component.css'
})
export class MoverInsumosComponent implements OnInit{
  locales!: Local[]
  localesEnviadores: Local[] = []
  localesRecibidores: Local[] = []
  localSeleccionadoEnviador!: Local
  localSeleccionadoIdEnviador!: number
  insumoSeleccionadoIdEnviador!: number
  insumoSeleccionadoEnviador!: Insumo
  localSeleccionadoRecibidor!: Local
  localSeleccionadoIdRecibidor!: number
  insumoSeleccionadoIdRecibidor!: number
  insumoSeleccionadoRecibidor!: Insumo
  cantidadAMover!: number

  constructor(private localService: LocalService,
    private storageService: StorageService,
    private router: Router,
  )
  {
  }

  ngOnInit(): void {
    this.obtenerLocales()
  }

  ngAfterViewInit():void{

  }

  obtenerLocales(){
    return this.localService.obtenerLocales().subscribe(
      (response: Local[]) =>{
        this.locales = response.filter(insumo => insumo.status === 'activo');
        this.localesEnviadores = this.locales;
        this.localSeleccionadoEnviador = this.localesEnviadores[0];
        this.localSeleccionadoIdEnviador = this.localSeleccionadoEnviador.id!;
        this.insumoSeleccionadoEnviador = this.localSeleccionadoEnviador.insumos![0];
        this.insumoSeleccionadoIdEnviador = this.insumoSeleccionadoEnviador.id!;
        this.filtrarLocalesRecibidores()
        console.log(this.localesEnviadores)
        console.log(this.localesRecibidores)
      },
      (error) =>{
        console.error('Error al obtener los insumos', error);
        if(error.status === 401){
          Swal.fire('Sesión Caducada!', 'Su sesión ha caducado, inicie sesión de nuevo.', 'info')
          .then(data => this.cerrarSesion())
        }
      }
    )
  }

  obtenerLocalEnviadorSeleccionado(){
    this.localSeleccionadoEnviador = this.locales.filter(local => local.id == this.localSeleccionadoIdEnviador)[0];
    this.filtrarLocalesRecibidores()
  }

  obtenerLocalRecibidorSeleccionado(){
    this.localSeleccionadoRecibidor = this.locales.find(local => local.id == this.localSeleccionadoIdRecibidor)!;
  }

  filtrarLocalesRecibidores(){
    this.localesRecibidores = this.locales.filter(local => local.id != this.localSeleccionadoIdEnviador);
    this.localSeleccionadoRecibidor = this.localesRecibidores[0];
    this.localSeleccionadoIdRecibidor = this.localSeleccionadoRecibidor.id!;
  }

  validarEnvio(insumoId: number){
    this.insumoSeleccionadoEnviador = this.localSeleccionadoEnviador.insumos?.find(insumo => insumo.id == insumoId)!;
    this.insumoSeleccionadoIdEnviador = this.insumoSeleccionadoEnviador.id!;
    const mensaje = `Ingrese la cantidad que desee enviar`;

    Swal.fire({
      title: 'Mover Insumos!',
      html: mensaje,
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Continuar',
      input: 'number',
    })
    .then((response) => {
      if(response.isConfirmed){
        this.cantidadAMover = response.value;
        if(this.insumoSeleccionadoEnviador.InsumoLocal?.cantidad == 0){
          Swal.fire('Error al mover!', 'No hay insumos en el local, registrelos.', 'error')
        }
        else if (this.insumoSeleccionadoEnviador.InsumoLocal?.cantidad! < this.cantidadAMover){
          Swal.fire('Error al mover!', 'No puede enviar más insumos de los que hay en el local. Verifique la cantidad.', 'error')
        }
        else{
          this.confirmarEnvio()
        }
      }
    });
  }

  confirmarEnvio(){
    let mensaje = '-Insumo a mover: ' + this.insumoSeleccionadoEnviador.nombre + ' -- Cantidad: ' + this.cantidadAMover;
    mensaje += '<br>-Local que recibe: ' + this.localSeleccionadoRecibidor.nombre;

    Swal.fire({
      title: 'Mover Insumos!',
      html: mensaje,
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí'
    })
    .then((response) => {
      if(response.isConfirmed){
        this.moverInsumos()
      }
    });
  }

  moverInsumos(){
    this.localService.moverInsumosAOtroLocal(this.localSeleccionadoEnviador.id!, this.localSeleccionadoRecibidor.id!, this.insumoSeleccionadoEnviador.id!, this.cantidadAMover).subscribe(
      (response) => {
        console.log('Insumos Movidos', response);
        Swal.fire({
          title: 'Insumos Movidos!',
          html: 'Los insumos se han movido correctamente',
          icon: 'success',
          confirmButtonText: 'OK'
        })
        .then((response) => {
          window.location.reload()
        });
      },
      (error) => {
        console.error('Error al mover insumos', error);
        if(error.status === 401){
          Swal.fire('Sesión Caducada!', 'Su sesión ha caducado, inicie sesión de nuevo.', 'info')
          .then(data => this.cerrarSesion())
        }
      }
    )
  }

  obtenerInsumoSeleccionado(){
    this.insumoSeleccionadoEnviador = this.localSeleccionadoEnviador.insumos?.find(insumos => insumos.id == this.insumoSeleccionadoIdEnviador)!;
  }

  otroInsumo(){
    this.insumoSeleccionadoIdEnviador = 1;
    this.cantidadAMover = 1;
  }

  cerrarSesion(){
    this.storageService.cerrarSesion();
    this.storageService.volverMenuPrincipal();
  }

  irAgregarIsumos(){
    let mensaje = '¿Desea ir a la pantalla de <b>Agregar Insumos</b>? <br>Los insumos sin mover no se guardarán.'
    Swal.fire({
      title: 'Ir a Agregar Insumos!',
      html: mensaje,
      icon: 'info',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí'
    })
    .then((response) => {
      if(response.isConfirmed){
        this.router.navigate(['/dashboard', 'add-insumos'])
      }
    });
  }
  irListadoLocales(){
    let mensaje = '¿Desea ir a la pantalla de <b>Listar Locales</b>? <br>Los insumos sin mover no se guardarán.'
    Swal.fire({
      title: 'Ir al Listado de Locales!',
      html: mensaje,
      icon: 'info',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí'
    })
    .then((response) => {
      if(response.isConfirmed){
        this.router.navigate(['/dashboard', 'salones'])
      }
    });
  }
}
