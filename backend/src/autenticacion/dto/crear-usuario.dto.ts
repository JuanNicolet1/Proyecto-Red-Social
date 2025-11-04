import { Type } from 'class-transformer'; // Transforma a valores
import { IsNotEmpty, IsString, MinLength, IsEmail, IsDate } from 'class-validator';

export class CrearUsuarioDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  nombre: string;

  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @IsString()
  apellido: string;

  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  @IsString()
  username: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsNotEmpty({ message: 'La fecha de nacimiento es obligatorio' })
  @Type(() => Date)
  @IsDate()
  fecha_nacimiento: Date;

  @IsNotEmpty({ message: 'Sin descripcion' })
  @IsString()
  descripcion: string;

  @IsNotEmpty({ message: 'Sin rol' })
  @IsString()
  rol?: string;

  @IsNotEmpty({ message: 'Sin imagen' })
  @IsString()
  imagenPerfil: string;
}