import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RolService } from '../../../../services/rol.service';
import { Rol } from '../../../../models/rol.model';
import { Patterns } from '../../../../utils/patterns';

@Component({
  selector: 'app-nuevo-rol',
  templateUrl: './nuevo-rol.component.html',
  styleUrls: ['./nuevo-rol.component.css']
})
export class NuevoRolComponent implements OnInit {
  rolForm!: FormGroup;
  passwordPattern: RegExp = Patterns.PASSWORD_PATTERN.getPattern();
  namePattern: RegExp = Patterns.NAME_PATTERN.getPattern();
  
  constructor(private fb: FormBuilder, private rolService: RolService) {}

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.rolForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(this.namePattern)]],
    });
  }

  guardarRol() {
    if (this.rolForm.valid) {
      const nuevoRol: Rol = this.rolForm.value;
      this.rolService.crearRol(nuevoRol).subscribe(
        (response) => {
          console.log('Rol creado correctamente:', response);
        },
        (error) => {
          console.error('Error al crear el rol:', error);
        }
      );
    }
  }
}