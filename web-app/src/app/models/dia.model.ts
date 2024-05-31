import { Deserializable } from "./deserializable.model";
import { LocalDia } from "./local.dia.model";

export class Dia implements Deserializable {
  id?: number;
  nombre?: string;
  createdAt?: Date;
  updatedAt?: Date;
  LocalDia?: LocalDia;

  deserializable(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
