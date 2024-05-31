import { Deserializable } from "./deserializable.model";
import { Insumo } from "./insumo.model";
import { Local } from "./local.model";

export class InsumoLocal implements Deserializable {
  id?: number;
  idInsumo?: number;
  idLocal?: number;
  cantidad?: number;
  createdAt?: Date;
  updatedAt?: Date;
  insumo?: Insumo;
  local?: Local;

  deserializable(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
