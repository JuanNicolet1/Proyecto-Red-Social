import { Type } from 'class-transformer'; // Transforma a valores
import { IsNotEmpty, IsString, MinLength, IsOptional, IsDate, IsNumber, IsBoolean } from 'class-validator';

export class CrearPublicacionDto {
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  @IsString()
  usuario: string;

  @IsNotEmpty({ message: 'Sin descripcion' })
  @IsString()
  titulo: string;

  @IsNotEmpty({ message: 'Sin descripcion' })
  @IsString()
  descripcion: string;

  @IsNotEmpty({ message: 'Sin likes'})
  @IsNumber()
  likes: number

  @IsBoolean()
  activo: boolean

  @IsNotEmpty({ message: 'La fecha es obligatorio' })
  @Type(() => Date)
  @IsDate()
  fecha: Date;

  @IsOptional()
  @IsString()
  imagen?: string;
}