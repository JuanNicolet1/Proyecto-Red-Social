import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  apellido: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true, unique: true, index: true })
  username: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  fecha_nacimiento: Date;

  @Prop({ required: true })
  descripcion: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// required es para indicar cuando un campo es obligatorio
// unique es para que lo que se escriba en ese campo no se repita
// index es para facilitar las búsquedas en ese campo