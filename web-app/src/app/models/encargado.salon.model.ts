import { Deserializable } from "./deserializable.model";
import { Usuario } from "./usuario.model";

export class EncargadoSalon implements Deserializable {
  id?: number;
  nombres?: string;
  apPaterno?: string;
  apMaterno?: string;
  telefono?: string;
  dni?: string;
  fechaContratacion?: Date;
  createdAt?: Date;
  usuarioId?: number;

  deserializable(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
