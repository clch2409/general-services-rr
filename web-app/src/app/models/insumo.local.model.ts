import { Deserializable } from "./deserializable.model";

export class InsumoLocal implements Deserializable {
  id?: number;
  idInsumo?: number;
  idLocal?: number;
  cantidad?: number;
  precio?: number;
  fechaPrecio?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  status?: string;

  deserializable(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
