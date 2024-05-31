import { Deserializable } from "./deserializable.model";
import { Colaborador } from "./colaborador.model";

export class Cargo implements Deserializable {
  id?: number;
  nombre?: string;
  createdAt?: Date;
  updatedAt?: Date;
  colaboradores?: Colaborador[];

  deserializable(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
