import { Deserializable } from "./deserializable.model";
import { Insumo } from "./insumo.model";
import { Servicio } from "./servicio.model";

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
  servicios?: Servicio[];

  deserializable(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
