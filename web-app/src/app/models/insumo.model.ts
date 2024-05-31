import { Deserializable } from "./deserializable.model";
import { InsumoLocal } from "./insumo.local.model";
import { Proveedor } from "./proveedor.model";

export class Insumo implements Deserializable {
  id?: number;
  nombre?: string;
  proveedorId?: number;
  precio?: number;
  createdAt?: Date;
  updatedAt?: Date;
  status?: string;
  proveedor?: Proveedor;
  InsumoLocal?: InsumoLocal;

  deserializable(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
