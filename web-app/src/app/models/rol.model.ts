import { Deserializable } from "./deserializable.model";
import { Usuario } from "./usuario.model";

export class Rol implements Deserializable {
  id?: number;
  nombre?: string;
  createdAt?: Date;
  usuarios?: Usuario[];

  deserializable(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
