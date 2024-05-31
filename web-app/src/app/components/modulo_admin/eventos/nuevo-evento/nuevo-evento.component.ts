import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventoService } from '../../../../services/evento.service';
import { Evento } from '../../../../models/evento.model';


@Component({
  selector: 'app-nuevo-evento',
  templateUrl: './nuevo-evento.component.html',
  styleUrls: ['./nuevo-evento.component.css']
})
//makecotizacion
export class NuevoEventoComponent implements OnInit{
  eventoForm!: FormGroup;

  constructor(private fb: FormBuilder, private eventoService: EventoService) { }

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.eventoForm = this.fb.group({
      servicios: ['', Validators.required],
      localId: ['', Validators.required],
      diaId: ['', Validators.required],
      cantidadPersonas: ['', Validators.required],
      tipoBuffetId: ['', Validators.required]
    });
  }

  hacerCotizacion() {
    if (this.eventoForm.valid) {
      const nuevaCotizacion: Evento = this.eventoForm.value;
      this.eventoService.makeCotizacion(nuevaCotizacion).subscribe(
        (response) => {
          console.log('Cotización creada correctamente:', response);
        },
        (error) => {
          console.error('Error al crear la cotización:', error);
        }
      );
    }
  }

  agregarServicios() {
    if (this.eventoForm.valid) {
      const { servicios, eventoId } = this.eventoForm.value;
      this.eventoService.agregarServiciosAlEvento(eventoId, servicios).subscribe(
        (response) => {
          console.log('Servicios agregados correctamente:', response);
        },
        (error) => {
          console.error('Error al agregar los servicios:', error);
        }
      );
    }
  }

  buscarEventoPorId() {
    const eventoId = this.eventoForm.get('eventoId')?.value;
    if (eventoId) {
      this.eventoService.obtenerEventoPorId(eventoId).subscribe(
        (response) => {
          console.log('Evento encontrado:', response);
        },
        (error) => {
          console.error('Error al buscar el evento:', error);
        }
      );
    }
  }
}
