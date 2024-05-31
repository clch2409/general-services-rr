import { Deserializable } from "./deserializable.model";
import { Usuario } from "./usuario.model";
import { Evento } from "./evento.model";

export class EncargadoSalon implements Deserializable {
  id?: number;
  nombres?: string;
  apPaterno?: string;
  apMaterno?: string;
  telefono?: string;
  dni?: string;
  fechaContratacion?: Date;
  usuarioId?: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  usuario?: Usuario;
  eventos?: Evento[];

  deserializable(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
