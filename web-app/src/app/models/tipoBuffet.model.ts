import { Deserializable } from "./deserializable.model";
import { Evento } from "./evento.model";

export class TipoBuffet implements Deserializable {
  id?: number;
  nombre?: string;
  precioPorPlato?: number;
  createdAt?: Date;
  updatedAt?: Date;
  eventos?: Evento[];

  deserializable(input: any): this {
    Object.assign(this, input);
    return this;
  }
}