import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PublicacionDocument = HydratedDocument<Publicacion>;

@Schema()
export class Publicacion {

  @Prop({ required: true })
  usuario: string;

  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ required: true, default: true })
  activo: boolean;

  @Prop({ required: true, default: 0 })
  likes: number;

  @Prop({ required: true })
  fecha: Date;

  @Prop({ required: false, default: null })
  imagen?: string;

  @Prop({ required: true, default: [] })
  usuariosLikes: string[];
}

export const PublicacionSchema = SchemaFactory.createForClass(Publicacion);