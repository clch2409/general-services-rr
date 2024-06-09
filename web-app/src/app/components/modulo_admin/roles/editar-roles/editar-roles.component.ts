import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RolService } from '../../../../services/rol.service';
import { Rol } from '../../../../models/rol.model';
import Swal from 'sweetalert2';
import { Patterns } from '../../../../utils/patterns';

@Component({
  selector: 'app-editar-roles',
  templateUrl: './editar-roles.component.html',
  styleUrls: ['./editar-roles.component.css']
})
export class EditarRolesComponent implements OnInit {
  rolForm: FormGroup;
  rolId: number;
  rol: Rol = new Rol();
  passwordPattern: RegExp = Patterns.PASSWORD_PATTERN.getPattern();
  namePattern: RegExp = Patterns.NAME_PATTERN.getPattern();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private rolService: RolService
  ) {
    this.rolId = 0;
    this.rolForm = this.fb.group({});
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.rolId = this.route.snapshot.params['rolid'];
    this.obtenerRol();
  }

  regresarListadoRoles(){
    this.router.navigate(['/dashboard', 'roles']);
  }

  obtenerRol() {
    this.rolService.obtenerRolPorId(this.rolId).subscribe({
      next: (data: Rol) => {
        this.rol = data;
        console.log(data)
        this.rolForm.patchValue(data);
      },
      error: err => {
        console.error('Error al obtener rol:', err);
      }
    });
  }

  inicializarFormulario() {
    this.rolForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(this.namePattern)]],
    });
  }

  validarFormulario(){
    if (this.rolForm.valid){
      this.solicitarConfirmacion()
    }
    else{
      Swal.fire('Datos Faltantes', 'Verifique que se estén ingresando todos los datos del rol', 'error')
    }
  }

  solicitarConfirmacion(): void{
    const rolActualizado: Rol = this.rolForm.value;
    let mensaje = `<b>Nombre</b>: ${rolActualizado.nombre}<br>`;
    Swal.fire({
      title: 'Confirmar Actualización',
      html: '¿Desea actualizar el rol con los siguientes datos?<br>' + mensaje,
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Sí',
      icon: 'question'
    }).then((result) => {
      if(result.isConfirmed){
        this.guardarCambios(rolActualizado);
      }
    })
  }

  guardarCambios(rolActualizado: Rol) {
    rolActualizado.nombre = rolActualizado.nombre?.toLowerCase();
    this.rolService.actualizarRol(this.rolId, rolActualizado).subscribe(
      (response) => {
        console.log('Rol actualizado correctamente:', response);
        this.router.navigate(['/lista-roles']);
      },
      (error) => {
        console.error('Error al actualizar el rol:', error);
      }
    );
  }
}
