import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ComentariosDocument = HydratedDocument<Comentarios>;

@Schema()
export class Comentarios{
    @Prop({ required: true })
    usuario: string;

    @Prop({ required: true })
    text: string;

    @Prop({ required: true })
    edit: boolean;

    @Prop({ required: true })
    fecha: Date;

    @Prop({ required: true })
    pubId: string;
}

export const ComentariosSchema = SchemaFactory.createForClass(Comentarios);