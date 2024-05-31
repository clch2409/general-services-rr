import { Deserializable } from "./deserializable.model";
import { Servicio } from "./servicio.model";
import { Evento } from "./evento.model";

export class ServicioEvento implements Deserializable {
    id?: number;
    servicioId?: number;
    eventoId?: number;
    createdAt?: Date;
    updatedAt?: Date;
    servicio?: Servicio;
    evento?: Evento;

    deserializable(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
