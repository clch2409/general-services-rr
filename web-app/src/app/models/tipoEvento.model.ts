import { Deserializable } from "./deserializable.model";
import { Evento } from "./evento.model";

export class TipoEvento implements Deserializable {
    id?: number;
    nombre?: string;
    createdAt?: Date;
    updatedAt?: Date;
    eventos?: Evento[];

    deserializable(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
