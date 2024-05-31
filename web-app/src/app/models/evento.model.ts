import { Deserializable } from "./deserializable.model";
import { EncargadoSalon } from "./encargadoSalon.model";
import { Cliente } from "./cliente.model";
import { Local } from "./local.model";
import { TipoEvento } from "./tipoEvento.model";
import { TipoBuffet } from "./tipoBuffet.model";
import { Servicio } from "./servicio.model";
import { Colaborador } from "./colaborador.model";

export class Evento implements Deserializable {
    id?: number;
    colorEvento?: string;
    fechaEvento?: Date;
    horaInicio?: Date;
    horaFin?: Date;
    cantidadPersonas?: number;
    tipoBuffetId?: number;
    encargadoId?: number;
    clienteId?: number;
    localId?: number;
    tipoEventoId?: number;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
    tipoBuffet?: TipoBuffet;
    encargado?: EncargadoSalon;
    cliente?: Cliente;
    local?: Local;
    tipoEvento?: TipoEvento;
    servicios?: Servicio[];
    colaboradores?: Colaborador[];

    deserializable(input: any): this {
        Object.assign(this, input);
        return this;
    }
}
