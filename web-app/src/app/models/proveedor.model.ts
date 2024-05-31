import { Deserializable } from "./deserializable.model";
import { Insumo } from "./insumo.model";

export class Proveedor implements Deserializable {
  id?: number;
  nombre?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  fechaContrato?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  status?: string;
  insumos?: Insumo[];

  deserializable(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
