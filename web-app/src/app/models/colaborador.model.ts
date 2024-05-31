import { Deserializable } from "./deserializable.model";
import { Cargo } from "./cargo.model";

export class Colaborador implements Deserializable {
  id?: number;
  nombres?: string;
  apPaterno?: string;
  apMaterno?: string;
  telefono?: string;
  dni?: string;
  email?: string;
  fechaContratacion?: Date;
  cargoId?: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  cargo?: Cargo;

  deserializable(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
