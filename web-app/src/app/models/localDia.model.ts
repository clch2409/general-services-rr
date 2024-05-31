import { Deserializable } from "./deserializable.model";
import { Local } from "./local.model";
import { Dia } from "./dia.model";

export class LocalDia implements Deserializable {
  id?: number;
  idLocal?: number;
  idDia?: number;
  precioLocal?: number;
  createdAt?: Date;
  updatedAt?: Date;
  status?: string;
  local?: Local;
  dia?: Dia;

  deserializable(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
