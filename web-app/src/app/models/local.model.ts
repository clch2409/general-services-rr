import { Deserializable } from "./deserializable.model";
import { Dia } from "./dia.model";
import { Evento } from "./evento.model";
import { Insumo } from "./insumo.model";

export class Local implements Deserializable {
  id?: number;
  nombre?: string;
  descripcion?: string;
  direccion?: string;
  aforoMaximo?: number;
  aforoMinimo?: number;
  fechaInactivacion?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  status?: string;
  insumos?: Insumo[];
  precios?: Dia[];
  eventos?: Evento[];

  deserializable(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
