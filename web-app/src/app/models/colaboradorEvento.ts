import { Colaborador } from "./colaborador.model";
import { Deserializable } from "./deserializable.model";
import { Evento } from "./evento.model";

export class ColaboradorEvento implements Deserializable{
  id?: number;
  colaboradorId?: number;
  eventoId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  status?: string;
  colaborador?: Colaborador;
  evento?: Evento;

  deserializable(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
