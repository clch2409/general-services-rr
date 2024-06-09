import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../../../../services/cliente.service';
import { Cliente } from '../../../../models/cliente.model';
import Swal from 'sweetalert2';
import { StorageService } from '../../../../services/storage.service';
import { Patterns } from '../../../../utils/patterns';

@Component({
  selector: 'app-editar-clientes',
  templateUrl: './editar-clientes.component.html',
  styleUrls: ['./editar-clientes.component.css']
})
export class EditarClientesComponent implements OnInit {
  clienteForm: FormGroup;
  clienteId: number;
  cliente: Cliente = new Cliente();
  passwordPattern: RegExp = Patterns.PASSWORD_PATTERN.getPattern();
  namePattern: RegExp = Patterns.NAME_PATTERN.getPattern();
  dniPattern: RegExp = Patterns.DNI_PATTERN.getPattern();
  phonePattern: RegExp = Patterns.PHONE_PATTERN.getPattern();
  directionPattern: RegExp = Patterns.DIRECTION_PATTERN.getPattern();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private storageService: StorageService
  ) {
    this.clienteId = 0;
    this.clienteForm = this.fb.group({});
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.clienteForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      apPaterno: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      apMaterno: ['', [Validators.required, Validators.pattern(this.namePattern)]],
      telefono: ['', [Validators.required, Validators.pattern(this.phonePattern)]],
      dni: ['', [Validators.required, Validators.pattern(this.dniPattern)]],
      direccion: ['', [Validators.required, Validators.pattern(this.directionPattern)]]
    });
  }

  ngOnInit(): void {
    this.clienteId = this.route.snapshot.params['cliid'];
    console.log(this.clienteId)
    this.obtenerCliente();
  }

  ngAfterViewInit(): void{
    this.storageService.comprobarSesion();
  }

  ngOnChanges(): void{
    this.storageService.comprobarSesion();
  }

  obtenerCliente() {
    this.clienteService.obtenerClientePorId(this.clienteId).subscribe({
      next: (data: Cliente) => {
        console.log(data);
        this.cliente = data;
        this.clienteForm.patchValue(data);
      },
      error: err => {
        console.error('Error al obtener cliente:', err);
        if (err.status === 401){
          Swal.fire('Sesión Caducada', 'Su sesión ha cadicado. Inicie sesión de nuevo, por favor.', 'info').then(data => this.cerrarSesion());
        }
      }
    });
  }

  regresarListadoClientes(){
    this.router.navigate(['/dashboard', 'clientes'])
  }

  validarFormulario(){
    if (this.clienteForm.valid){
      this.confirmarGuardado()
    }
    else{
      Swal.fire('Datos Faltantes', 'Verifique que se estén ingresando todos los datos del Cliente', 'error')
    }
  }

  confirmarGuardado(): void{
    const clienteActualizado: Cliente = this.clienteForm.value;
    let mensaje = `Nombres: ${clienteActualizado.nombres}<br>`;
     mensaje += `Apellidos: ${clienteActualizado.apPaterno} ${clienteActualizado.apMaterno}<br>`;
     mensaje += `Dni: ${clienteActualizado.dni}<br>`;
     mensaje += `Telefono: ${clienteActualizado.telefono}<br>`;
     mensaje += `Direccion: ${clienteActualizado.direccion}<br>`;
    Swal.fire({
      title: 'Confirmar Actualización',
      html: '¿Desea actualizar el cliente con los siguientes datos?<br>' + mensaje,
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      icon: 'question'
    }).then((result) => {
      if(result.isConfirmed){
        this.actualizarCliente(clienteActualizado);
      }
    })
  }

  actualizarCliente(clienteActualizado: Cliente) {
    this.clienteService.actualizarCliente(this.clienteId, clienteActualizado).subscribe({
      next: data => {
        Swal.fire('Cliente Actualizado!', 'Cliente actualizado exitosamente', 'success')
        .then((result) => {
          this.router.navigate(['/dashboard', 'clientes']);
        });

      },
      error: err => {
        Swal.fire('Error!', 'Hubo un problema al actualizar el cliente', 'error');
        console.error('Error al actualizar cliente:', err);
      }
    });
  }

  cerrarSesion(){
    this.storageService.cerrarSesion();
    this.storageService.volverMenuPrincipal();
  }
}

