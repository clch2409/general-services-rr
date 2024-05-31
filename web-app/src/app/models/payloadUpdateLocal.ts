import { Deserializable } from "./deserializable.model";
import { Local } from "./local.model";


export class PayloadUpdateLocal implements Deserializable{
  local?: Local;
  fechaInactivacion?: Date;

  deserializable(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
