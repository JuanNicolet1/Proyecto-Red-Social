import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength, IsEmail, IsDate } from 'class-validator';

export class CrearUsuarioDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  nombre: string;

  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @IsString()
  apellido: string;

  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @IsEmail({}, { message: 'El correo electrónico no es válido' }) // Ejemplo de validación
  email: string;

  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  @IsString()
  username: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' }) // Ejemplo de validación
  password: string;

  @IsNotEmpty({ message: 'La fecha de nacimiento es obligatorio' })
  @Type(() => Date)
  @IsDate()
  fecha_nacimiento: Date;

  @IsNotEmpty({ message: 'Sin descripcion' })
  @IsString()
  descripcion: string;
}