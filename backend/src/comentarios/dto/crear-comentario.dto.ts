import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength, IsOptional, IsDate, IsNumber, IsBoolean } from 'class-validator';

export class CrearComentariosDto {
    @IsNotEmpty({ message: 'El usuario es obligatorio' })
    @IsString()
    usuario: string;

    @IsNotEmpty({ message: 'El texto es obligatorio' })
    @IsString()
    text: string;

    @IsNotEmpty({ message: 'La fecha es obligatorio' })
    @Type(() => Date)
    @IsDate()
    fecha: Date;

    @IsBoolean()
    edit: boolean
}