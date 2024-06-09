import { Deserializable } from "./deserializable.model";
import { Proveedor } from "./proveedor.model";

export class Servicio implements Deserializable {
    id?: number;
    nombre?: string;
    precio?: number;
    createdAt?: Date;
    updatedAt?: Date;
    proveedorId?: number;
    proveedor?: Proveedor;

    deserializable(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
