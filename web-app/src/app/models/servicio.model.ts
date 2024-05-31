import { Deserializable } from "./deserializable.model";

export class Servicio implements Deserializable {
    id?: number;
    nombre?: string;
    precio?: number;
    createdAt?: Date;
    updatedAt?: Date;

    deserializable(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
