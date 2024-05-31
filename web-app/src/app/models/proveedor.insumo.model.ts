import { Deserializable } from "./deserializable.model";
import { Proveedor } from "./proveedor.model";
import { Insumo } from "./insumo.model";

export class ProveedorInsumo implements Deserializable {
  id?: number;
  idProveedor?: number;
  idInsumo?: number;
  createdAt?: Date;
  updatedAt?: Date;

  deserializable(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
