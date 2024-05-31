import { Component, OnInit } from '@angular/core';
import { Insumo } from '../../../../models/insumo.model';
import { Local } from '../../../../models/local.model';
import { LocalService } from '../../../../services/local.service';
import { InsumoService } from '../../../../services/insumo.service';
import Swal from 'sweetalert2';
import { StorageService } from '../../../../services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agregar-insumos',
  templateUrl: './agregar-insumos.component.html',
  styleUrl: './agregar-insumos.component.css'
})
export class AgregarInsumosComponent implements OnInit{

  insumos!: Insumo[]
  locales!: Local[]
  localSeleccionadoId!: number;
  localSeleccionado!: Local;
  insumosSeleccionados: any[] = [];
  insumoSeleccionado: String = '';
  cantidadSeleccionada: number = 1;
  accion = 'asignar';
  cantidadAsignar = 0

  constructor(private localService: LocalService,
    private insumoService: InsumoService,
    private storageService: StorageService,
    private router: Router
  )
  {
  }

  ngOnInit(): void {
    this.obtenerLocales()
    this.obtenerInsumos();
  }

  ngAfterViewInit():void{

  }

  obtenerInsumos(){
    this.insumoService.obtenerInsumos().subscribe(
      (response: Insumo[]) =>{
        this.insumos = response.filter(insumo => insumo.status === 'activo');
        console.log(response)
      },
      (error) =>{
        console.error('Error al obtener los insumos', error);
        if(error.status === 401){
          Swal.fire('Sesión Caducada!', 'Su sesión ha caducado, inicie sesión de nuevo.', 'info')
          .then(data => this.cerrarSesion())
        }
      }
    );
  }

  obtenerLocales(){
    return this.localService.obtenerLocales().subscribe(
      (response: Local[]) =>{
        this.locales = response.filter(insumo => insumo.status === 'activo');
        this.localSeleccionado = this.locales[0];
        this.localSeleccionadoId = this.localSeleccionado.id!
        console.log(this.locales)
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

  obtenerLocalSeleccionado(){
    this.localSeleccionado = this.locales.filter(local => local.id == this.localSeleccionadoId)[0];
  }

  quitarInsumo(id: any){
    const insumoSeleccionadoSelector = document.getElementById('selected-'+ id) as HTMLSpanElement;
    console.log({
      id: id,
      valor: insumoSeleccionadoSelector.textContent,
    })
    const insumoSeleccionado = this.insumos.find(insumo => insumo.nombre === insumoSeleccionadoSelector.textContent);

    this.insumosSeleccionados = this.insumosSeleccionados.filter(insumo => insumo.insumo.nombre !== insumoSeleccionado?.nombre)
  }

  agregarInsumos(){
    const insumoSeleccionado = this.insumos.find(insumo => insumo.nombre === this.insumoSeleccionado);
    const cantidadInsumos = this.cantidadSeleccionada;
    const findInsumoSeleccionado = this.insumosSeleccionados.find(insumo => insumo.insumo.nombre === insumoSeleccionado?.nombre);

    if(findInsumoSeleccionado){
      this.insumosSeleccionados = this.insumosSeleccionados.map(insumo => {
        if (insumo.insumo.id === findInsumoSeleccionado.insumo.id){
          return {
            ...insumo,
            cantidad:  insumo.cantidad + cantidadInsumos
          }
        }
      });
    }else{
      this.insumosSeleccionados.push({
        insumo: insumoSeleccionado,
        cantidad: cantidadInsumos
      })
    }
  }

  validarAsignacion(){
    if (this.insumosSeleccionados.length === 0){
      Swal.fire('Insumos No Seleccionados', 'Recuerde seleccionar Insumos para poder asginarlos al local escogido', 'warning')
    }
    else{
      this.confirmarAsignacion();
    }
  }

  confirmarAsignacion(){
    let mensaje = '';
    this.insumosSeleccionados.forEach(insumo => {
      mensaje += `-${insumo.insumo.nombre} --> ${insumo.cantidad} unidades<br>`
    })
    Swal.fire({
      title: 'Asignar Insumos a Local!',
      html: '¿Desea Asignar los siguientes insumos?<br>' + mensaje,
      icon: 'info',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí'
    })
    .then((response) => {
      if(response.isConfirmed){
        this.asignarInsumos()
      }
    });
  }

  asignarInsumos(){

    this.insumosSeleccionados.forEach((insumo) => {
      this.localService.agregarInsumoAlLocal(this.localSeleccionado.id!, insumo.insumo.id,insumo.cantidad).subscribe(
        (reponse) => {
          console.log(reponse);
        },
        (error)=>{
          console.error('Error al asignar Insumos', error)
        }
      );
    })
    window.location.reload()
  }

  verificarSeleccionInsumo(){
    if (this.insumoSeleccionado === ''){
      Swal.fire('Insumo No Seleccionado', 'Recuerde seleccionar el insumo antes de agregarlo', 'warning')
    }
    else{
      this.agregarInsumos()
    }
  }

  otroInsumo(){
    this.insumoSeleccionado = '';
    this.cantidadSeleccionada = 1;
  }

  cerrarSesion(){
    this.storageService.cerrarSesion();
    this.storageService.volverMenuPrincipal();
  }



  confirmarRetiro(id: number){
    const nombreInsumoARetirar = document.getElementById('insumoLocalSelected-'+id) as HTMLSpanElement;
    const insumoARetirar = this.localSeleccionado.insumos?.find(insumo => insumo.nombre == nombreInsumoARetirar.textContent);
    let mensaje = `¿Desea retirar <b>${insumoARetirar?.nombre}</b> de <b>${this.localSeleccionado.nombre}</b>?`;
    Swal.fire({
      title: 'Retirar Insumo del Local!',
      html: mensaje,
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí'
    })
    .then((response) => {
      if(response.isConfirmed){
        this.validarCantidad(insumoARetirar!)
      }
    });
  }

  validarCantidad(insumo: Insumo){
    let mensaje = 'Ingrese la cantidad que desee retirar: '
    Swal.fire({
      title: 'Ingresar Cantidad Insumos',
      html: mensaje,
      icon: 'info',
      input: 'number',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí'
    })
    .then((response) => {
      if(response.isConfirmed && response.value <= insumo.InsumoLocal?.cantidad!){
        this.retirarLocal(insumo.id!, parseInt(response.value))
      }
      else if(response.isConfirmed && insumo.InsumoLocal?.cantidad! == 0){
        Swal.fire('Sin Insumos en Local', 'No hay insumos para retirar del local, ingrese o registre nuevos insumos', 'error')
      }
      else{
        Swal.fire('Insumo Faltante en Local', 'No puede retirar más insumos de los que hay en el local', 'error')
      }
    });
  }

  retirarLocal(idInsumo:number, cantidad:number){
    console.log({
      idInsumo,
      cantidad
    })
    this.localService.retirarInsumosDelLocal(this.localSeleccionadoId, idInsumo, cantidad).subscribe(
      (response) => {
        console.log('Retirado con éxito', response);
        Swal.fire({
          title: 'Insumo Retiradoº',
          html: 'El insumo ha sido retirado correctamente.',
          icon: 'success',
          confirmButtonText: 'OK',
        })
        .then((response) => {
          window.location.reload();
        })

      },
      (error) => {
        console.error('Error en retirar insumos', error);
      }
    )
  }

  irMoverInsumo(){
    let mensaje = '¿Desea ir a la pantalla de <b>Mover Insumos</b>? <br>Los insumos sin asignar no se guardarán.'
    Swal.fire({
      title: 'Ir a Mover Insumos!',
      html: mensaje,
      icon: 'info',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí'
    })
    .then((response) => {
      if(response.isConfirmed){
        this.router.navigate(['/dashboard', 'move-insumos'])
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
