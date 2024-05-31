import { Deserializable } from "./deserializable.model";
import { Rol } from "./rol.model";
import { Cliente } from "./cliente.model";
import { EncargadoSalon } from "./encargadoSalon.model";

export class Usuario implements Deserializable {
  id?: number;
  email?: string;
  contrasena?: string;
  recoveryToken?: string;
  createdAt?: Date;
  rolId?: number;
  status?: string;
  rol?: Rol;
  cliente?: Cliente;
  jefaSalon?: EncargadoSalon;

  deserializable(input: any): this {
    Object.assign(this, input);
    return this;
  }
}
